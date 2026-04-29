public class UserSearchResponse {
  private Integer id;
  private String username;
  private String firstName;
  private String lastName;
  private String profilePictureUrl;

  public UserSearchResponse(User user) {
    this.id = user.getId();
    this.username = user.getUsername();
    this.firstName = user.getFirst_name();
    this.lastName = user.getLast_name();
    this.profilePictureUrl = user.getProfile_picture_url();
  }

  // getters
  public Integer getID(){ return id; }

  public String getUsername(){ return username; }

  public String getFirst_name(){ return first_name; }

  public String getLast_name(){ return last_name; }

  public String getProfile_picture_url(){ return profile_picture_url; }
}