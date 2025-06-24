package eic.teamMaker.repository;

import eic.teamMaker.entity.GroupInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupInfoRepository extends JpaRepository<GroupInfo, Long> {
    GroupInfo findByGroupCode(String groupCode);
}
