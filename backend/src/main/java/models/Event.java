
public class Event{

	String name;
	String date;
  	String time; 
	boolean pubEvent;
	
	Event(String name, String date,String time, boolean pubEvent){
		this.name = name;
		this.date = date;
		this.time = time;
    	this.pubEvent = true;
    
	}
	//getters
	public String getName() {
		return name;
	}
  	public String getDate() {
		return date;
	}
 	public String getTime() {
		return time;
	}
  	public boolean getPub() {
		return pubEvent;
	}
	//setters
	public void setUser(String name) {
		this.name = name;
	}
  	public void setDate(String date) {
		this.date = date;
	}
  	public void setTime(String time) {
		this.time = time;
	}
  	public void setPub(boolean pubEvent) {
		this.pubEvent = pubEvent;
	}
	
}
