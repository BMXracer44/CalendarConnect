import java.util.List;

@RestController
@RequestMapping("/event")
@CrossOrigin
public class EventController {
    @Autowired
    private EventService eventService;

    @PostMapping("/add")
    public String add(@RequestBody Event event){
        eventService.saveEvent(event);
        return "New Event is added";
    }

    @GetMapping
    public ResponseEntity<List<Event>> getEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
}