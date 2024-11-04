/******************************************************************************
 * Survey
 */

import type { ISurveyModel } from './services/fundermaps/interfaces/survey/ISurveyModel'

export interface ISurveyStoreState {
  Model: ISurveyModel
}

/******************************************************************************
 * Util
 */
export interface ILocalCheckboxGroupModel {
  [key: number | string]: 'yes' | 'no'
}
