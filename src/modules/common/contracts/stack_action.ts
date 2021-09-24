import { StackActionType } from '../enums/stack_action_type';

interface StackActionPayload<AD, AT> {
  type: AD;
  data: AT;
}

export interface StackActionItem<AD = any, AT = any> {
  type: StackActionType;
  payload: StackActionPayload<AD, AT>;
}

export interface ChapterActionItem {
  type: StackActionType;
  payload: {
    chaptername: string;
    boardname: string;
    classname: string;
    subjectname: string;
    newchaptername?: string;
  };
}
