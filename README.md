#Netflix Shuffle

A shuffle button for Netflix TV shows.

To operate, simply navigate to a show's page on Netflix and click the extension's button. A random episode will play. The extension will also work if you access a show by searching, or through the 'Shows You Might Like' feature.

The extension will notify you if you are on an invalid page or a page for a show that hasn't been added. I am adding shows all the time. If there's a show you would like support for, send me a note and I'll add it in the next release.

Netflix Shuffle takes advantage of the Web Extension API that is shared by Chrome and Firefox. To build the extensions, run python3 build_extension.py. This will generate .zip files for the Firefox and Chrome versions of the extension.

#Adding/Updating the shows.json

Since Netflix isn't a fan of scraping, I wrote a python script (dionysus.py) that helps automate some of this. Netflix follows two patters in listing it's shows:

1. Shows are identified through an eight-digit ID (showID), and this is viewable through accessing netflix.com/title/[showID].
2. Episodes are also identified through an eight-digit ID (episodeID), and (for the most part) episodeIDs increment through a season (Futurama is perhaps the biggest violator of this rule, which, given its broadcast history, I find cosmically amusing).

To add a show, run

    python3 dionysus.py a

And follow its instructions. After the first four digits are added, one only needs to enter the last four of the first episode, then hit [ENTER] to increment until all the episodes from the season are logged. Entering 'q' stops the adding for a season and moves on to the next (or terminates the script if the final season is reached). Be sure to double check the episodes' IDs as you go through a show, as Netflix tends to switch up its ID scheme when you're not paying attention.

dionyus.py also generates (through the 'u' flag) the shows.json for the extension from the shows.csv file that contains every episode.

#List of Shows

These are the shows currently in the shows.json

==== LIST OF SHOWS ====
30 Rock
Alias
American Horror Story
Archer
Arrested Development
Arrow
Black Mirror
Bob Ross: Beauty Is Everywhere
Bob's Burgers
Bojack Horseman
Bones
Breaking Bad
Buffy the Vampire Slayer
Californication
Cheers
Chuck
Cosmos: A Spacetime Odyssey
Criminal Minds
Daredevil
Dexter
Everybody Loves Raymond
Family Guy
Firefly
Frasier
Freaks and Geeks
Friday Night Lights
Friends
Fringe
Futurama
Gilmore Girls
Glee
Gossip Girl
Grey's Anatomy
Hawaii Five-0
Hell on Wheels
Heroes
House M.D.
House of Cards
How I Met Your Mother
It's Always Sunny In Philadelphia
Jane the Virgin
Jessica Jones
Justice League
Justice League Unlimited
Kill La Kill
Law & Order: Special Victims Unit
Lost
Luther
Mad Men
Malcolm in the Middle
Marvel's Agents of S.H.I.E.L.D.
Master of None
NCIS
Narcos
New Girl
Nurse Jackie
Once Upon A Time
One Tree Hill
Orange Is The New Black
Parks and Recreation
Phineas and Ferb
Portlandia
Prison Break
Psych
Scandal
Scooby-Doo!: Mystery Incorporated
Scrubs
Sherlock
Sons of Anarchy
Star Trek
Star Trek: Deep Space Nine
Star Trek: Enterprise
Star Trek: The Next Generation
Star Trek: Voyager
Star Wars: The Clone Wars
Stranger Things
Supernatural
That '70s Show
The Blacklist
The Flash
The IT Crowd
The League
The Magic School Bus
The Office (US)
The Twilight Zone
The Walking Dead
The West Wing
The X-Files
Unbreakable Kimmy Schmidt
Weeds
Young Justice
==============

Television icon from [Icon Works](http://www.flaticon.com/authors/icon-works). Shuffle icon from [Pavel Kozlov](http://www.flaticon.com/authors/pavel-kozlov)
