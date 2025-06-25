package eic.teamMaker.controller;
import eic.teamMaker.dto.StudentRequest;

import eic.teamMaker.entity.GroupInfo;
import eic.teamMaker.entity.GroupStudent;
import eic.teamMaker.repository.GroupInfoRepository;
import eic.teamMaker.repository.GroupStudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private GroupInfoRepository groupInfoRepository;

    @Autowired
    private GroupStudentRepository groupStudentRepository;

    @PostMapping("/create")
    public GroupStudent createStudent(@RequestBody StudentRequest studentRequest) {
        // 1. groupCode로 group_info 테이블에서 groupId 찾기
        GroupInfo groupInfo = groupInfoRepository.findByGroupCode(studentRequest.getGroupCode());

        if (groupInfo == null) {
            throw new IllegalArgumentException("해당 그룹 코드가 존재하지 않습니다.");
        }

        // 2. 학생 정보 저장
        GroupStudent groupStudent = new GroupStudent();
        groupStudent.setStudentName(studentRequest.getStudentName());
        groupStudent.setPhoneNumber(studentRequest.getPhoneNumber());
        groupStudent.setMbti(studentRequest.getMbti());
        groupStudent.setRole_type(studentRequest.getRole_type());
        groupStudent.setGroupInfo(groupInfo); // groupId 연결!

        return groupStudentRepository.save(groupStudent);
    }

    @GetMapping("/count/{groupCode}")
    public int getParticipantCount(@PathVariable String groupCode) {
        GroupInfo group = groupInfoRepository.findByGroupCode(groupCode);
        if (group == null) {
            throw new IllegalArgumentException("그룹 코드가 유효하지 않습니다.");
        }
        return groupStudentRepository.countByGroupInfo(group);
    }

    @GetMapping("/list/{groupCode}")
    public List<GroupStudent> getStudentsByGroupCode(@PathVariable String groupCode) {
        GroupInfo group = groupInfoRepository.findByGroupCode(groupCode);
        if (group == null) {
            throw new IllegalArgumentException("그룹 코드가 유효하지 않습니다.");
        }

        return groupStudentRepository.findByGroupInfo(group);
    }

}
