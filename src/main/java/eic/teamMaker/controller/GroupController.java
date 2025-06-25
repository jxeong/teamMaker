package eic.teamMaker.controller;

import eic.teamMaker.dto.AuthRequest;
import eic.teamMaker.entity.GroupInfo;
import eic.teamMaker.repository.GroupInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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

    @PostMapping("/auth")
    public Map<String, Boolean> authenticateGroup(@RequestBody AuthRequest request) {
        GroupInfo groupInfo = groupInfoRepository.findByGroupCode(request.getGroupCode());

        Map<String, Boolean> response = new HashMap<>();
        if (groupInfo != null && groupInfo.getGroupPassword().equals(request.getPassword())) {
            response.put("authenticated", true);
        } else {
            response.put("authenticated", false);
        }

        return response;
    }

}
