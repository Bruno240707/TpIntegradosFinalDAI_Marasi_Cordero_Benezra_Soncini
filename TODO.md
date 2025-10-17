# TODO for Walk Tracking and History Implementation

- [x] Create AuthContext.js for managing authentication state
- [x] Create LoginScreen.js component with email and password inputs and toggle for registration
- [x] Modify App.js to use Stack Navigator and conditionally render LoginScreen or TabNavigator based on auth state
- [x] Implement login logic in LoginScreen to query 'usuarios' table via Supabase
- [x] Implement registration logic in AuthContext to insert into 'usuarios' table
- [x] Add logout button in header of TabNavigator
- [x] Implement walk tracking in WalkScreen with GPS, accelerometer, and save to 'caminatas' table
- [x] Update MapScreen to display walk history from 'caminatas' table
- [x] Rename "Mapa" tab to "Caminatas" in App.js
- [x] Test login and registration flow
- [x] Test walk tracking and history display
