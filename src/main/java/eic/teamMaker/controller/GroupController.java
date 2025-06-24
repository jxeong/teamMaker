package eic.teamMaker.controller;

import eic.teamMaker.entity.GroupInfo;
import eic.teamMaker.repository.GroupInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/group")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {

    @Autowired
    private GroupInfoRepository groupInfoRepository;

    @PostMapping("/create")
    public GroupInfo createGroup(@RequestBody GroupInfo groupInfo) {
        return groupInfoRepository.save(groupInfo);
    }
    @GetMapping("/info/{groupCode}")
    public GroupInfo getGroupInfo(@PathVariable String groupCode) {
        GroupInfo groupInfo = groupInfoRepository.findByGroupCode(groupCode);

        if (groupInfo == null) {
            throw new IllegalArgumentException("해당 그룹 코드가 존재하지 않습니다.");
        }

        return groupInfo;
    }

}
