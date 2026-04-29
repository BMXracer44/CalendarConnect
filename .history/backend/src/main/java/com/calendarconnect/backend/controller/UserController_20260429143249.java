@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

  @Autowired
  private UserService userService;

  // SEARCH USERS
  @GetMapping("/search")
  public List<UserSearchResponse> searchUsers(
      @RequestParam String query,
      @RequestParam int currentUserId
  ) {
    return userService.searchUsers(query, currentUserId);
  }

  // ✅ THIS IS THE MISSING PIECE (FIXES YOUR ERROR)
  @GetMapping("/{username}")
  public User getUserByUsername(@PathVariable String username) throws Exception {
    return userService.findByUsername(username);
  }
}