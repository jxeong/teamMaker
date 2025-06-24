package eic.teamMaker.repository;
import eic.teamMaker.entity.GroupInfo;
import eic.teamMaker.entity.GroupStudent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupStudentRepository extends JpaRepository<GroupStudent, Long> {
    int countByGroupInfo(GroupInfo groupInfo);
}

