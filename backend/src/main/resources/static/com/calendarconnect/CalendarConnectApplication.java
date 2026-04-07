import java.io.IOException;
import java.util.InputMismatchException;
import java.util.Scanner;


public class CalendarConnect {
	public static void main(String[] args) throws IOException {
		
		SecurityConfig auth = new SecurityConfig();
		
		try(Scanner scanner = new Scanner(System.in);){
		
		System.out.println("Welcome to Calendar Conenect!");
		//selection needs change for controller
		System.out.println("1)Register account");	
		System.out.println("2)Log in");
		
		int choice = scanner.nextInt();
		scanner.nextLine();
		
		System.out.print("Enter Username: ");
		String user = scanner.nextLine();
		System.out.print("Enter Password: ");
		String password = scanner.nextLine();
		
		if(choice ==1) {
			auth.register(user, password);
		}
		if(choice ==2) {
			auth.login(user, password);
		}
		
		}//end try
		catch(InputMismatchException e) {
			System.out.println("You must enter a number.");
		}
		//scanner.close();
		
		
	}
}
