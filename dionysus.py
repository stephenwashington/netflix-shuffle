#!/usr/bin/env python3
import json
from sys import exit, argv

# Adds a show to shows.csv
# Format of shows.csv: tv_show_name,show_id,season,episode,episode_id
# Most of the time, episode numbers are sequential within a season
# To make it faster to add shows, hit [ENTER] when adding subsequent episodes
# 'q' terminates a season's entry, increments, and repeats
def add_show():
    with open("shows.csv", "a") as f:
        show_title = input("Title of show: ")
        show_id = input("Show ID: ")
        num_seasons = int(input("Number of seasons: "))

        for s in range(1,num_seasons+1):
            first_four = input("First four digits of showID of first episode of season {}: ".format(s))
            e = 0
            last = '0000'
            while True:
                e += 1
                last_four = input("Last four digits of Season {}, episode {}: ".format(s,e))
                if last_four == "q":
                    break
                elif last_four == "":
                    last_four = str(int(last) + 1).zfill(4)
                last = last_four
                f.write("{},{},{},{},{}\n".format(show_title, show_id,s, e, str(first_four + last_four)))
        print("{} added\n".format(show_title))

def lookup_show():
    with open("extension/data/shows.json", "r") as f:
        show_json = json.load(f)
        show_id = input("Show ID for lookup: ")
        if show_id in show_json:
            print("{} is '{}'".format(show_id,show_json[show_id]["showTitle"]))
        else:
            print("{} is not in shows.csv".format(show_id))


# Generates shows.json from shows.csv
def generate_shows():
    with open("shows.csv","r") as fin, open("extension/data/shows.json", "w") as fout:
        show_json = {}
        for line in fin:
            l = line.split(",")
            show_title, show_id, episode_id = l[0], l[1], l[4]

            if show_id not in show_json:
                show_json[show_id] = {'showTitle' : show_title, 'episodes' : []}
            else:
                show_json[show_id]['episodes'].append(episode_id.rstrip())

        json.dump(show_json, fout, indent=4, sort_keys=True)
        print("shows.json generated\n")

# Generates a list of shows, as well as basic stats
def show_stats():
    with open("extension/data/shows.json", "r") as fjson, open("shows.csv") as fcsv:
        print("==== LIST OF SHOWS ====")
        show_json = json.load(fjson)
        show_list = []
        for show in show_json.keys():
            show_list.append(show_json[show]["showTitle"])
        print("\n".join(show for show in sorted(show_list)))
        print("-----------------------")
        print("{} shows".format(len(show_json.keys())))
        line_count = sum(1 for _ in fcsv)
        print("{} episodes".format(line_count))


def main():
    if len(argv) == 2:
        if argv[1] == "a":
            add_show()
        elif argv[1] == "l":
            lookup_show()
        elif argv[1] == "u":
            generate_shows()
        elif argv[1] == "s":
            show_stats()
        else:
            print("\nDIONYSUS - Netflix Shuffle Helper Script:\n    [a]dd a title\n    [l]ookup a title,\n    [u]pdate the json,\n    [s]how stats\n")
    else:
        print("\nDIONYSUS - Netflix Shuffle Helper Script:\n    [a]dd a title\n    [l]ookup a title,\n    [u]pdate the json,\n    [s]how stats\n")


if __name__ == '__main__':
    main()
