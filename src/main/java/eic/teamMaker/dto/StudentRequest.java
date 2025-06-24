package eic.teamMaker.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentRequest {
    private String studentName;
    private String phoneNumber;
    private String mbti;
    private String groupCode; // 입력받은 그룹코드
}
