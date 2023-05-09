import os
import argparse
import tekore as tk
import boto3
from tqdm import tqdm
import requests
import json
import pprint

"""
This is some of the worst fking code ever written.

putting this here mostly as a landmark but also in the 
rare case that it's ever a better use of my time
to just offload this manual uploading job to someone 
else instead of creating a better system / having enough 
scale to not need to shamelessly pirate songs from spotify
"""

SPOTIFY_CLIENT_ID = 'lol'
SPOTIFY_CLIENT_SECRET = 'lol'

SUPABASE_URL = 'https://hhxrnscvjkseuojixcxe.supabase.co/rest/v1'
SERVICE_KEY = 'lol'

pp = pprint.PrettyPrinter()

def create_object_name(mdata):
    DEFAULT_AUDIO_PATH = 'audio'
    artist_names = ", ".join(mdata['artists'])
    return f"{DEFAULT_AUDIO_PATH}/{artist_names.replace('-', '$dash')} - {mdata['name'].replace('-', '$dash')}.mp3"


def download_mp3(url, name): 
    command = f'spotdl --playlist-numbering --output afiles.nosync/{name}/{{list-position}} {url}'
    os.system(command)


def rename_mp3s(pname, metadata_gen):
    gen_path = f'afiles.nosync/{pname}'
    for i, mdata in enumerate(metadata_gen):
        # again, assuming playlists have between 10 and 99 songs
        fname = ('{:02}'.format(i+1) if i+1<10 else "{:2}".format(i+1)) + '.mp3'
        fpath = f'{gen_path}/{fname}'
        oname = create_object_name(mdata)[6:]
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

def send_to_s3(pname, metadata_gen):
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
the most beautiful, safe, atomic sql function ever written

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
            ON CONFLICT (name) DO NOTHING
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
            'cdn_path': create_object_name(mdata),
            'origin_url': mdata['spotify_url'],
        })
    
    data = json.dumps({'playlist': {
        'name': pname, 
        'track_count': pobj.tracks.total,
        'origin_url': f'https://open.spotify.com/playlist/{pobj.uri.split(":")[-1]}',
    }, 'songs': songs})
    url = 'https://hhxrnscvjkseuojixcxe.supabase.co/rest/v1/rpc/add_playlist_with_songs_safe'
    headers = {'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': f'Bearer {SERVICE_KEY}'}
    response = requests.post(url, headers=headers, data=data)
    print(response.json())

    # url = f'{SUPABASE_URL}/static_playlists'
    # data = json.dumps(payload)
    # headers = {
    #     'apikey': SERVICE_KEY,
    #     'Authorization': f'Bearer {SERVICE_KEY}',
    #     'Prefer': 'resolution=merge-duplicates',
    #     'Content-Type': 'application/json'
    # }
    # response = requests.post(url, headers=headers, data=data)
    # print(response.json())

if __name__ == '__main__':
    """
    the arguments here are a total clusterfk (it's in theme)
    basically, i wanted to break it down into an mp3 download and metadata parsing section
    i then realized that about 10% of the time spotdl would fail to download all the mp3s properly
    so you need to rerun it. this is an issue because i statefully assume
    in the file renaming part that everything's been downloaded correctly

    thus, it's broken down into s1, s2, and s3 (aka pass in nothing)
    which correspond to mp3 download, renaming, and parsing + push to supabase

    you'll need to create a local directory called afiles.nosync...
    or something else but then you'd have to go up and figure out 
    where to change it in the code. there's a nosync suffix because
    on my machine macos will periodically move large files off disk to save mem.

    i also have a function in here that automatically renames + pushes things
    into the palet-audio-files s3 bucket but the access control stuff
    is all out of whack. in the spirit of doing things that don't scale
    i'm just assuming we're gonna download 17 songs at a time
    and manually upload them to the s3 bucket (really not the worst...)

    if the schema changes at all at any point all of this breaks
    but we're running with it for now just to have some structure
    that works client side.

    there's really only like 60 lines of real code in this file
    and it still took me an entire day to get everything to work.
    """

    parser = argparse.ArgumentParser()
    parser.add_argument('--s1', action='store_true')
    parser.add_argument('--s2', action='store_true')
    parser.add_argument('--url', type=str, required=True)
    parser.add_argument('--name', type=str, required=True)
    args = parser.parse_args()

    url, pname, s1, s2 = args.url, args.name, args.s1, args.s2
    if not s1: 
        sp = authorize_tekore()
        pobj = sp.playlist((url.split('/')[-1]).split('?')[0])
        mdata_gen = yield_metadata(pobj)
        print('obtained mdata')

    if s1: download_mp3(url, pname)
    elif s2: rename_mp3s(pname, mdata_gen)
    else: send_to_db(pname, pobj, mdata_gen)

