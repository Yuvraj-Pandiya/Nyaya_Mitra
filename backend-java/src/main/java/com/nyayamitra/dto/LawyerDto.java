package com.nyayamitra.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/** LawyerDto — response shape matching Node.js Mongoose Lawyer document exactly */
@Data
@Builder
public class LawyerDto {
    private Long id;
    private String name;
    private List<String> specializations;
    private String state;
    private String city;
    private String phone;
    private String email;
    private String organization;
    private List<String> languages;
    private boolean proBono;
    private Integer experience;
    private String barCouncilId;
    private List<String> availableFor;
    private Double rating;
    private String locationLink;
    private Double lat;
    private Double lng;
}
