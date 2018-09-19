# Neighborhood_Map

this project is a single webpage show the user several places with markers,
by clicking on any marker an infowindow is populated and shows the name and the address of this place,
also the user finds these places in the side bar to choose any place he want,
and he can use a search input to search the place he want with name or address.

this project uses google APIs and foursquqre API.


##run 
to run this project :-
  1. download or clone this project.
  2. open `maps.html` .
  
  
## vagrant virtual machine
  to install Linux-based virtual machine (VM) :-
  1. Install VirtualBox from https://www.virtualbox.org/wiki/Download_Old_Builds_5_1
  2. Install Vagrant from https://www.vagrantup.com/downloads.html
  3. Download the VM configuration from https://s3.amazonaws.com/video.udacity-data.com/topher/2018/April/5acfbfa3_fsnd-virtual-machine/fsnd-virtual-machine.zip
  4. use your terminal and go to the directory called vagrant using `cd`
  5. Start the virtual machine using `vagrant up` command
  6. you can run `vagrant ssh` to log in to your newly installed Linux VM
  
  
##Notes
  to change the places shown in this project:-
    1. go ahead to `js` folder
    2. open `project.js` in your favourite text editor
    3. change the place type in line `35` according to `https://developers.google.com/places/supported_types` by using them own words only
    4. change the radius in line `34` to cover any area you want.
    5. change the center point where the map start with by changing the `lat` and `lng` values in line `21`. 
