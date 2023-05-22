import os
import argparse
import tekore as tk
import boto3
from tqdm import tqdm
import requests
import json
import pprint

"""
This is some of the worst fking code ever written
"""

SPOTIFY_CLIENT_ID = ''
SPOTIFY_CLIENT_SECRET = ''

SUPABASE_URL = 'https://hhxrnscvjkseuojixcxe.supabase.co/rest/v1'
SERVICE_KEY = ''

pp = pprint.PrettyPrinter()

"""
Replaces - with $dash (infallibe, i know)
List of comma delimited artist names followed by song name
"""
DEFAULT_AUDIO_PATH = ''
def create_object_name(mdata):
    artist_names = ", ".join(mdata['artists'])
    return f"{DEFAULT_AUDIO_PATH}/{artist_names.replace('-', '~!~').replace(',', '~?~')} - {mdata['name'].replace('-', '~!~').replace(',', '~?~')}.mp3"

def download_mp3(url, name): 
    command = f'spotdl --playlist-numbering --output afiles.nosync/{name}/{{list-position}} {url}'
    os.system(command)

def rename_mp3s(pname, metadata_gen):
    gen_path = f'afiles.nosync/{pname}'
    for i, mdata in enumerate(metadata_gen):
        # again, assuming playlists have between 10 and 99 songs
        fname = ('{:02}'.format(i+1) if i+1<10 else "{:2}".format(i+1)) + '.mp3'
        fpath = f'{gen_path}/{fname}'
        oname = create_object_name(mdata)[len(DEFAULT_AUDIO_PATH)+1:]
        print(oname)
        opath = f'{gen_path}/"{oname}"'
        command = f'mv {fpath} {opath}'
        os.system(command)

def authorize_tekore(): 
    app_token = tk.request_client_token(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
    return tk.Spotify(app_token)

def yield_metadata(pobj):
    for t in pobj.tracks.items: 
        det = t.track
        artist_names = []
        for a in det.artists: artist_names.append(a.name)
        yield {
            'spotify_url': 'https://open.spotify.com/track/' + det.id,
            'artists': artist_names,
            'duration': det.duration_ms,
            'name': det.name
        }

def send_to_cloud(pname, metadata_gen):
     for i, mdata in tqdm(enumerate(metadata_gen)):
        fname = ('{:02}'.format(i+1) if i+1<10 else "{:2}".format(i+1)) + '.mp3'
        oname = create_object_name(mdata)
        print(oname)

        s3 = boto3.client('s3')
        try: s3.upload_file(f'afiles.nosync/{name}/{fname}', 'palet-audio-files', oname)
        except Exception as e: print('ERROR: ', e)  

        # TODO: 
        # ExtraArgs={'Metadata': {
        #     'spotify_url': mdata['url'],
        #     'duration': mdata['duration'],
        #     'name': mdata['name']
        # }}

"""
CREATE OR REPLACE FUNCTION add_playlist_with_songs_safe(playlist static_playlists, songs static_tracks[])
RETURNS void AS $$
DECLARE
    i INTEGER := 0;
    tid INTEGER;
    pid INTEGER;
    song RECORD;
BEGIN
    INSERT INTO static_playlists (name, track_count, origin_url)
    VALUES (playlist.name, playlist.track_count, playlist.origin_url)
    RETURNING id INTO pid;

    FOREACH song IN ARRAY songs LOOP
        i := i + 1;
        BEGIN
            INSERT INTO static_tracks (name, duration_ms, artists, cdn_path, origin_url)
            VALUES (song.name, song.duration_ms, song.artists, song.cdn_path, song.origin_url)
            ON CONFLICT (name, duration_ms, artists) DO NOTHING
            RETURNING id INTO tid;

            IF tid IS NULL THEN
                SELECT id FROM static_tracks WHERE name = song.name AND duration_ms = song.duration_ms AND artists = song.artists INTO tid;
            END IF;
        END;
        
        INSERT INTO playlists_tracks (track_id, playlist_id, track_index)
        VALUES (tid, pid, i);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

"""

def send_to_db(pname, pobj, metadata_gen):
    songs = []
    for mdata in metadata_gen:
        songs.append({
            'name': mdata['name'],
            'duration_ms': mdata['duration'],
            'artists': mdata['artists'],
            'cdn_path': create_object_name(mdata)[1:],
            'origin_url': mdata['spotify_url'],
        })

    print(songs)

def find_spotify_image_src(pobj):
    print(pobj.images[0].url)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--s1', action='store_true')
    parser.add_argument('--s2', action='store_true')
    parser.add_argument('--img', action='store_true')
    parser.add_argument('--url', type=str, required=True)
    parser.add_argument('--name', type=str, required=True)
    args = parser.parse_args()

    url, pname, s1, s2, img = args.url, args.name, args.s1, args.s2, args.img
    if not s1: 
        sp = authorize_tekore()
        pobj = sp.playlist((url.split('/')[-1]).split('?')[0])
        mdata_gen = yield_metadata(pobj)

    if img: find_spotify_image_src(pobj)
    elif s1: download_mp3(url, pname)
    elif s2: rename_mp3s(pname, mdata_gen)
    else: send_to_db(pname, pobj, mdata_gen)

