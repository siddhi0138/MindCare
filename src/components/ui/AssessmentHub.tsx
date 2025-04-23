import React from 'react';

export type AssessmentType = 'PHQ-9' | 'GAD-7' | 'DASS-21';

export interface Assessment {
  type: AssessmentType;
  name: string;
  description: string;
}

export const assessments: Assessment[] = [
  {
    type: 'PHQ-9',
    name: 'PHQ-9 Depression Test',
    description: 'A brief questionnaire designed to assess the severity of depression.',
  },
  {
    type: 'GAD-7',
    name: 'GAD-7 Anxiety Test',
    description: 'A brief questionnaire designed to assess the severity of anxiety.',
  },
  {
    type: 'DASS-21',
    name: 'DASS-21 Stress, Anxiety, Depression Test',
    description: 'The DASS-21 is designed to measure the severity of a range of symptoms common to depression, anxiety and general stress.',
  },
];