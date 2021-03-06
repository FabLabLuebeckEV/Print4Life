# Changelog

## Unreleased / Upcoming next

* multilanguage support for English, German and Danish (/LF0380/)

### No Version number yet

### Version 0.8
* upgrade from Angular 6 to 8
* implemented new Design
* implemented print4life-idea (makers and hospitals)
* switch login to email and password

### Version 0.7
* users can activate themselfs by a link via email
* landing page redsigned and added support for mobile devices
* public orders heavily redisgned
* initial location will be retrieved from the browsers
* maschine detail show correct schedules
* no more orders without empty user addresses
* user address is only visible for the user itself and the admins
* fixed a lot of typos and measurment units
* fixed input types for various input fields

### Version 0.6.2

* correctly parse env variable NG_PORT as number and therefore correctly check for it being port 80 to set baseURLFrontend with or without port addition
* implement new env variable for EMAIL_ADDRESS as it may differ from EMAIL_USER
* add ecosystem for tzl deploy
* add log message for http or https server start to see if the server accepted SSL keys

### Version 0.6.1

* fix table headers of order list (now shows on empty table)
* use baseUrlFrontend as whitelist for cors
* set email secure to false for production and add another api password for gmail
* show table headers even for empty tables
* update table of iot device list view if a device is deleted
* disable machine info button on create shared order
* set validation error messages for shipping address fields of create order form
* correct behaviour of scheduling validation of create order form (now allows only complete start- and end dates)
* schedules are deleted if they are emptied on create order form (former: didn't delete model relation with order <--> schedule)
* make loggedInUser a component variable on order list

### Version 0.6

* added ModalService
* added Buttons as Components
* added IoT Device Support (/LF0010/, /LF0020/, /LF0030/, /LF0040/)
* added Octoprint bridge
* fixed DatePicker ChangeEvent on entering input without DatePicker
* unfinished orders filters fixed on schedules and fablabs
* fixed spinner on order list
* tooltips on buttons

### Version 0.5.2

* email fix (smtp config updated)
* added fablabs in user list and detail view
* filter for fablabs added in user list
* fix error messages to use old and new styled error messages

### Version 0.5.1

* fix cors to enable non port urls
* add timePickError as reason why to disable the submit button in create order view

### Version 0.5

* implemented upload of files (/LF0300/, /LF0330/)
* implemented unfinsihed orders list (/LF0270/)
* implemented success history for orders (/LF0280/)
* implemented machine statistics (currently successful orders; /LF0280/)
* implemented shared orders to allow guests to create, edit and view orders (/LF0360/)
* added shipping address to orders (selectable via user address, custom address, fablab (of user) address)
* refactored backend controller to use own services
* routes decoupled from controller functions
* added search for username, firstname, lastname and email of users in user list
* added search for projectname of orders in order lists
* added search for devicename and manufacturer of machine in machine lists
* added scheduling for orders and machines
* deleting machines results to state deactivate instead of a hard deletion
* added deployment to production server
* create oder form now uses local storage to contain some information on changing views
* adding checkbox for copyright question on uploaded files
* adding unknown machine type on create order for users that don't know the correct machine type
* order form now only shows machines of a specific fablab (choosing a fablab is a mandatory field now)
* order form now only shows editors of a specific fablab
* download of files is only allowed for owner, editors and admins
* files are now deletable and deprecated files are deleted if order status switches to 'completed', 'representive', 'archived' or 'deleted'
* unfinished order list can now be filtered by machine types

### Version 0.4.1

* fix cors with https
* fix specs and use env configs
* use ecosystem.config.js file for pm2
* setup https backend server for prod
* fix deploy scripts to include email-templates in dist build
* fix duplicate orders in order list
* fix user based switch language

### Version 0.4

* user and role management implemented
* users can register to the platform (/LF0210/)
* users can now login (/LF0220/)
* admins receive emails regarding new registered users and activation requests of inactive user profiles
* users can reset passwords if they can't remember their password via entering the e-mail address. If the e-mail address is correct, a new password will be sent to that address (/LF0240/)
* users can change passwords on their profile page (/LF0330/)
* users can select a preferred language which will be used on the frontend and also for received emails (no dk support yet)
* users can only edit own orders (except for editors/admins)
* orders are assignable to editors (/LF0350/)
* comments, owner and editors are now based on user objects instead of strings
* fablab is now an entity with an address assignable to users as an optional field
* renaming printers to 3d-printers
* guests (not logged in users) now can only see the order list

## Version 0.3.2

* translation fix in create order form

## Version 0.3.1

* minor cors fix

## Version 0.3

* implemented translation to English and German

## Version 0.2.1

* add dns to cors settings
* add changelog

## Version 0.2

* basic CRUDs for machines
* basic CRUDs for orders
* frontend to list machines (/LF0250/)
* frontend to list orders (/LF0260/)
* frontend to create, edit, read and delete machines (not included upload of files and CRUD for laser types and material; regarding spec /LF0370/)
* frontend to create, edit, read and delete orders (not included user model, delivery address, upload of files and timeslots for production; regarding spec /LF0300/, /LF0310/, /LF0320/, /LF0340/)
* pagination for order list and machine list
* filter by status and machine type for order list
* filter by machine type for machine list
* icon and tooltip to symbol public fields (/LF0330/)

## Version 0.1

* Init of project structure