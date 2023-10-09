'use strict';


import {LabelInputType} from "../html/tinyComponents/LabelInputType.js";
import {createSettingsComponent} from "../html/inputForm/inputForm.js";

createSettingsComponent([
  new LabelInputType('numRows', 'number', 'Rows'),
  new LabelInputType('numCols', 'number', 'Cols'),
  new LabelInputType('tileSize', 'number', 'Tile Size'),
  new LabelInputType('gameId', 'string', 'Game Id', null, 'auto', true),
  new LabelInputType('autoNewGame', 'checkbox', 'Auto New Game')
]);
