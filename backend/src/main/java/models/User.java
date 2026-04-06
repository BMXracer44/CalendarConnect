import java.util.Arraylist;
public class User implements event.java{

	int id;
	String email;
	String username;
	String passwordHash;
	String firstN;
	String lastN;
	string birthdate
	String phoneNum;
	String bio;
	String url;
	ArrayList<String> friends = new ArrayList<String>();
	ArrayList<event> events = new ArrayList<event>();
	boolean themePref;
	
	
	
	User(String user, String password,ArrayList<String> friends,ArrayList<event> events){
		this.user = user;
		this.password = password;
		this.friends = friends;
		this.events = events;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public ArrayList getfriends() {
		return friends;
	}
	public void setFriends(ArrayList<String> friends) {
		this.friends = friends;
	}
	public ArrayList getEvents() {
		return events;
	}
	public void setEvents(ArrayList<event> evnets) {
		this.events = events;
	}
}
