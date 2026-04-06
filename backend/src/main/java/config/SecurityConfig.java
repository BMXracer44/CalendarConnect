import java.util.HashMap;

public class SecurityConfig {
	HashMap<String, String> newUser = new HashMap<String, String>();
	
	public boolean register(String user, String password) {
		
		if (newUser.containsKey(user)) {
			System.out.println("Username already exists");
			return false;																	}//end if
	while(password.isEmpty() || password.length()<= 8) {
			
			if(user.equalsIgnoreCase(password)) {
				System.out.println("Password cannot equal Username");	
				return false;	}//end if
			if(password.length() <= 8) {
			System.out.println("Password must be greater than 8 characters"); 
			return false;		}//end if
			
											}//end while
		newUser.put(user, password);
		System.out.println("User is registered");
		return true;
		}//end register
	public boolean login(String user, String password) {
		
		if (!newUser.containsKey(user)) {
			System.out.println("Username does not exist");
			return false;
		}
		String storedPassword = newUser.get(user);
		
		if(storedPassword.equals(password)) {
			System.out.println("Hello " + user + " welcome to Calendar Connect!");
			return true;
		}
		else {
			System.out.println("Wrong Password");
			return false;
		}
	}// end login
		
}
