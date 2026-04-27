import java.util.Arraylist;
import javax.persistence.Entity;
import javax.persistence.GeneratedType;
import javax.persistence.GeneratedValue;	
import javax.persistence.Id;

@Entity
public class User implements event.java{
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	int id;
	String email;
	String username;
	String passwordHash;
	String firstN;
	String lastN;
	String birthdate;
	String phoneNum;
	String bio;
	String url;
	ArrayList<String> friends = new ArrayList<String>();
	ArrayList<Event> events = new ArrayList<Event>();
	boolean themePref;
	
	public User(){ //Default constructor
	}
	
	User(String user, String password,ArrayList<String> friends,ArrayList<Event> events){
		this.user = user;
		this.passwordHash = passwordHash;
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
	public void setEvents(ArrayList<Event> evnets) {
		this.events = events;
	}
}
