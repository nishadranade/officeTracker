# officeTracker

**Operations on the Database** 

**For Employees (from the Android App)**
1. Create Account - Inserts a new user into the Users table

2. Login - Queries the Users database to check if entered userId exists

3. CheckIn - Inserts a new entry in the Visits table with endTime set to default value/put an "ongoing" flag

4. CheckOut - Updates endTime value of existing visit in the Visits table by finding "ongoing" visit for corresponding userId

**For the Admin (from the Web Client)**
1. Admin Login Page - no querying for now since everyone has admin access
2. Find all users that were in contact with a given user in given time period
3. 
