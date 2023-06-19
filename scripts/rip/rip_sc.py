import argparse
import json
import os
import pickle
import re
import urllib.parse
from typing import List, Tuple
import requests
from rip_spot import SERVICE_KEY

import boto3
from tqdm import tqdm


def cleanse_unsafe_characters(str):
    pattern = r"[^0-9a-zA-Z!-_.*'()]+"
    cleansed_string = re.sub(pattern, "_", str)
    return cleansed_string


def download_mp3s(playlist_url, orig_name, new_name):
    os.system(f"scdl -l {playlist_url} ")


def yield_metadata(path):
    playlist_metadata: List[Tuple[str, str]] = []
    for filename in tqdm(os.listdir(path)):
        fpath = f'{path}/"{filename}"'
        if filename.endswith(".mp3"):
            command = f"ffprobe -v quiet -print_format json -show_format -show_streams {fpath}"
            output = os.popen(command).read()
            metadata = json.loads(output)

            duration = (
                float(metadata["format"]["duration"])
                if "duration" in metadata["format"]
                else 0.0
            )
            artist = metadata["format"]["tags"].get("artist", "Unknown Artist")
            sname = metadata["format"]["tags"].get("title", "Unknown Song")
            playlist_metadata.append((artist, sname, duration))

            object_name = cleanse_unsafe_characters(f"{artist} - {sname}.mp3")
            new_fpath = f'{path}/"{object_name}"'
            try:
                os.system(f"mv {fpath} {new_fpath}")
            except Exception as e:
                continue
        else:
            print("Not an mp3 file: ", filename)

    with open("pickles/club.pickle", "wb") as f:
        pickle.dump(playlist_metadata, f)


def upload_to_pg(pname, purl, metadata_path):
    with open(metadata_path, "rb") as file:
        song_metadata = pickle.load(file)

    songs = []
    seen = {""}
    cloudfront = boto3.client("cloudfront")
    distro = cloudfront.list_distributions()["DistributionList"]["Items"][1]
    distro_name = f'https://{distro["DomainName"]}'
    for mdata in song_metadata:
        if mdata[1] in seen:
            continue
        object_name = cleanse_unsafe_characters(f"{mdata[0]} - {mdata[1]}.mp3")
        songs.append(
            {
                "name": mdata[1],
                "duration_ms": int(mdata[2] * 1000),
                "artists": [mdata[0]],
                "cdn_path": f"{distro_name}/soundcloud/{urllib.parse.quote_plus(object_name)}",
                "origin_url": None,
                "sc_origin": True,
            }
        )
        seen.add(mdata[1])

    data = json.dumps(
        {
            "playlist": {
                "name": pname,
                "track_count": len(song_metadata),
                "origin_url": purl,
                "route_alias": "",
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
    # parser = argparse.ArgumentParser()
    # parser.add_argument("-u", "--url", type=str, required=True)

    # args = parser.parse_args()
    # url = args.url

    # scrape_playlist_tracks(url)

    print('hello')

    download_mp3s(
        "https://soundcloud.com/palet-music/sets/berlin-techno/s-1xOB6mWR37F?si=f516edda01c040b5bcab74989d1033e3&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
        "Club",
        "club",
    )
    # yield_metadata("afiles.nosync/club")
    # upload_to_pg(
    #     "The Kernagis Club Mix",
    #     "https://soundcloud.com/alex-kernagis/sets/club/s-ILPGsQNghcO?si=c9a221b6707440d78f8ab47a23129020&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
    #     "pickles/club.pickle",
    # )


# DECLARE
#     i INTEGER := 0;
#     tid INTEGER;
#     pid INTEGER;
#     song RECORD;
# BEGIN
#     INSERT INTO static_playlists (name, track_count, origin_url, route_alias)
#     VALUES (playlist.name, playlist.track_count, playlist.origin_url, playlist.route_alias)
#     RETURNING id INTO pid;

#     FOREACH song IN ARRAY songs LOOP
#         i := i + 1;
#         BEGIN
#             INSERT INTO static_tracks (name, duration_ms, artists, cdn_path, origin_url, sc_origin)
#             VALUES (song.name, song.duration_ms, song.artists, song.cdn_path, song.origin_url, song.sc_origin)
#             ON CONFLICT (name) DO NOTHING
#             RETURNING id INTO tid;

#             IF tid IS NULL THEN
#                 SELECT id FROM static_tracks WHERE name = song.name AND duration_ms = song.duration_ms AND artists = song.artists INTO tid;
#             END IF;
#         END;

#         INSERT INTO playlists_tracks (track_id, playlist_id, track_index)
#         VALUES (tid, pid, i);
#     END LOOP;
# END;
