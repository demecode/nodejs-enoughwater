import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import {
    leftInputMsg,
    rightInputMsg,
    leftUnitMsg,
    rightUnitMsg,
} from './Update'

const { div, h1, h2, pre, option, input, select, } = hh(h);

const LEFT_UNITS = ['KG', 'Pounds', 'Stone', ];
const RIGHT_UNIT = ['Litres'];

const unitOptions = (unitSelected) => {
    return R.map(
        unit => option({ value: unit, selected: unitSelected === unit }, unit),
        LEFT_UNITS
    )
}

const rightUnitOptions = (unitSelected) => {
    return R.map(
        unit => option({ value: unit, selected: unitSelected === unit }, unit),
        RIGHT_UNIT
    )
}

const unitFields = (dispatch, unit, value, inputMsg, unitMsg) => {
    console.log(value);
    return div({ className: 'w-60 ma1' }, [
        input({
            type: 'text',
            className: 'db w-100 mv2 pa2 input-reset ba',
            value,
            oninput: e => dispatch(inputMsg(e.target.value)),
        }),
        select({
                className: 'db w-100 mv2 pa2 input-reset br bg-white ba b--black',
                onchange: e => dispatch(unitMsg(e.target.value))
            },
            unitOptions(unit),
        )
    ]);
}

const rightUnitFields = (dispatch, unit, value, inputMsg, unitMsg) => {
    return div({ className: 'w-50 ma1' }, [
        input({
            type: 'text',
            className: 'db w-100 mv2 pa2 input-reset ba',
            value,
            oninput: e => dispatch(inputMsg(e.target.value)),
        }),
        select({
                className: 'db w-100 mv2 pa2 input-reset br bg-white ba b--black',
                onchange: e => dispatch(unitMsg(e.target.value))
            },
            rightUnitOptions(unit),
        )
    ]);
}


const view = (dispatch, model) => {
    return div({ className: 'mw6 center' }, [
        h1({ className: 'fw3' }, 'How much water should I drink?'),
        h2({ className: "mt2 mb0 f6 fw7 ttu trackefd" }, 'enter your weight below to find out'),
        div({ className: 'flex' }, [
            unitFields(
                dispatch,
                model.leftUnit,
                model.leftValue,
                leftInputMsg,
                leftUnitMsg,
            ),
            rightUnitFields(
                dispatch,
                model.rightUnit,
                model.rightValue,
                rightInputMsg,
                rightUnitMsg,
            ),
        ]),
        // pre(JSON.stringify(model, null, 2)),
    ]);
}

export default view;