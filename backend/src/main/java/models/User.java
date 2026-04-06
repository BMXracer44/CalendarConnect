import java.util.Arraylist;
public class User{

	String user;
	String password;
	ArrayList<String> friends = new ArrayList<String>();
	
	User(String user, String password,ArrayList<String> friends){
		this.user = user;
		this.password = password;
		this.friends = friends
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getpassword() {
		return password;
	}
	public void setpassword(String password) {
		this.password = password;
	}
	public ArrayList getfriends() {
		return friends;
	}
	public void setpassword(ArrayList friends) {
		this.friends = friends;
	}
}
