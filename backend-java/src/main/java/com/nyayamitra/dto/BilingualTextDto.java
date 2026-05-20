package com.nyayamitra.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Bilingual text wrapper — mirrors MongoDB's { en: String, hi: String } sub-documents */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BilingualTextDto {
    private String en;
    private String hi;
}
