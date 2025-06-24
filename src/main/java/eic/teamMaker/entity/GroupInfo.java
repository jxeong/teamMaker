package eic.teamMaker.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "group_info")
public class GroupInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupId;

    private String creatorName;
    private String creatorEmail;
    private String groupPassword;
    private String courseName;
    private int totalStudents;
    private int studentsPerTeam;
    private String groupCode;
}
