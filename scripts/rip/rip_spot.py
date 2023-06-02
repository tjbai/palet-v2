import os
import tekore as tk
from tqdm import tqdm
import boto3
import urllib.parse
import argparse
import json
import requests

SPOTIFY_CLIENT_ID = ""
SPOTIFY_CLIENT_SECRET = ""

SUPABASE_URL = "https://hhxrnscvjkseuojixcxe.supabase.co/rest/v1"
SERVICE_KEY = ""


def authorize_tekore():
    app_token = tk.request_client_token(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
    return tk.Spotify(app_token)


def create_object_name(metadata):
    artist_names = ", ".join(metadata["artists"])
    song_name = metadata["name"]
    return f"{artist_names} - {song_name}.mp3"


def yield_metadata(playlist_object):
    for t in playlist_object.tracks.items:
        det = t.track
        artist_names = []
        for a in det.artists:
            artist_names.append(a.name)
        yield {
            "spotify_url": "https://open.spotify.com/track/" + det.id,
            "artists": artist_names,
            "duration": det.duration_ms,
            "name": det.name,
        }


def download_mp3s(url, name):
    command = f"spotdl --playlist-numbering --output afiles.nosync/{name}/{{list-position}} {url}"
    os.system(command)


def rename_mp3s(name, metadata_generator):
    path = f"afiles.nosync/{name}"
    for i, mdata in enumerate(metadata_generator):
        fname = ("{:02}".format(i + 1) if i + 1 < 10 else "{:2}".format(i + 1)) + ".mp3"
        fpath = f"{path}/{fname}"
        oname = create_object_name(mdata)
        opath = f"{path}/'{oname}'"
        command = f"mv {fpath} {opath}"
        os.system(command)


# needs to be called after rename_mp3s
def upload_to_s3(name=None, metadata_generator=None):
    s3 = boto3.client("s3")
    for mdata in tqdm(metadata_generator):
        oname = create_object_name(mdata)
        opath = f"afiles.nosync/{name}/'{oname}'"
        try:
            s3.upload_file(opath, "palet-audio-files", oname)
        except Exception as e:
            print("Error: ", e)
            exit(1)


def upload_to_pg(pname, playlist_object, metadata_generator):
    songs = []
    cloudfront = boto3.client("cloudfront")
    distro = cloudfront.list_distributions()["DistributionList"]["Items"][1]
    distro_name = f'https://{distro["DomainName"]}'
    for mdata in metadata_generator:
        songs.append(
            {
                "name": mdata["name"],
                "duration_ms": mdata["duration"],
                "artists": mdata["artists"],
                "cdn_path": f"{distro_name}/{urllib.parse.quote(create_object_name(mdata))}",
                "origin_url": mdata["spotify_url"],
                "sc_origin": False,
            }
        )

    data = json.dumps(
        {
            "playlist": {
                "name": pname,
                "track_count": len(songs),
                "origin_url": f'https://open.spotify.com/playlist/{playlist_object.uri.split(":")[-1]}',
                "route_alias": pname,
            },
            "songs": songs,
        }
    )
    url = "https://hhxrnscvjkseuojixcxe.supabase.co/rest/v1/rpc/add_playlist_with_songs_safe"
    headers = {
        "Content-Type": "application/json",
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
    }
    response = requests.post(url, headers=headers, data=data)

    try:
        print(response.status_code)
        print(response.json())
    except Exception as e:
        print(f"encountered: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-u", "--url", type=str, required=True)
    parser.add_argument("-n", "--name", type=str, required=True)
    parser.add_argument("-s", "--steps", type=int, nargs="+", required=True)

    args = parser.parse_args()
    url, name, steps = args.url, args.name, args.steps

    if 1 in steps:
        download_mp3s(url, name)

    sp = authorize_tekore()
    pobj = sp.playlist((url.split("/")[-1]).split("?")[0])
    mdata_gen = yield_metadata(pobj)

    if 2 in steps:
        rename_mp3s(name, mdata_gen)

    if 3 in steps:
        upload_to_pg(name, pobj, mdata_gen)

    if 4 in steps:
        upload_to_s3(name, mdata_gen)
