import * as R from 'ramda';

export const MSGS = {
    LEFT_INPUT_MSG: 'LEFT_INPUT_MSG',
    RIGHT_INPUT_MSG: 'RIGHT_INPUT_MSG',
    LEFT_UNIT_MSG: 'LEFT_UNIT_MSG',
    RIGHT_UNIT_MSG: 'RIGHT_UNIT_MSG',
    KG_TO_DRINKING_LITRES: 'KG_TO_DRINKING_LITRES',
    // POUNDS_TO_DRINKING_LITRES: 'POUNDS_TO_DRINKING_LITRES',
    // STONE_TO_DRINKING_LITRES: 'POUNDS_TO_DRINKING_LITRES',
}

export const leftInputMsg = (leftValue) => {
    return {
        type: MSGS.LEFT_INPUT_MSG,
        leftValue,
    };
}

export const rightInputMsg = (rightValue) => {
    return {
        type: MSGS.RIGHT_INPUT_MSG,
        rightValue,
    }
}

export const leftUnitMsg = (leftUnit) => {
    return {
        type: MSGS.LEFT_UNIT_MSG,
        leftUnit,
    }
}

export const rightUnitMsg = (rightUnit) => {
    return {
        type: MSGS.RIGHT_UNIT_MSG,
        rightUnit,
    }
}

// converts string to number
const toInt = R.pipe(parseInt, R.defaultTo(0));

const update = (msg, model) => {
    switch(msg.type) {
        case MSGS.LEFT_INPUT_MSG: {
            if (msg.leftValue === '')
            return { ...model, sourceLeft: true, leftValue: '', rightValue: '' };
            const leftValue = toInt(msg.leftValue)
            return convert({ ...model, sourceLeft: true, leftValue });
        }
        case MSGS.RIGHT_INPUT_MSG: {
            if (msg.rightValue === '')
            return { ...model, sourceLeft: false, leftValue: '', rightValue: '' };
            const rightValue = toInt(msg.rightValue)
            return convert({ ...model, sourceLeft: false, rightValue });
        }
        case MSGS.RIGHT_UNIT_MSG: {
            const { rightUnit } = msg;
            return convert({ ...model, rightUnit });
        }

        case MSGS.LEFT_UNIT_MSG: {
            const { leftUnit } = msg;
            return convert({ ...model, leftUnit });
        }
    }
    return model;
}

const convert = (model) => {
    //destructure left / right values/units
    const { leftValue, leftUnit, rightValue, rightUnit } = model;
    // use destruction arrays -
    // when the sourceLeft is true
    // we unpack the unit to the left unit, fromWeight to the left value and the right unit (which will be converted to) etc
    // if false, we unpack the right unit and right temp etc
    const [fromUnit, fromWeight, toUnit] = 
    model.sourceLeft ? [leftUnit, leftValue, rightUnit] : [rightUnit, rightValue, leftUnit];

    const otherValue = R.pipe(
        // what should the litres read?
        convertedFromToLitres,
        round,
    )(fromUnit, toUnit, fromWeight)

    return model.sourceLeft ? { ...model, rightValue: otherValue } : { ...model, leftValue: otherValue };
}

const round = (number) => {
    return Math.round(number)
  }

  const convertedFromToLitres = (fromUnit, toUnit, weight) => {
    // R.pathOr looks at the unitconversion object
    // then attempst to return the nested valye in th obejct 
    // using the values in the arrary
    //example its looking at unitconversions.<fromUnit>.<toUnit>
    // unitconversions.Fahrenheit.Celsius
    const convertFn = R.pathOr(
      R.identity,
      [fromUnit, toUnit],
      UnitConversions);
      return convertFn(weight);
  }

  const kgToLitres = (weight) => {
      return (weight - 32) * 9/5;
  }

  const poundsToLitres = (weight) => {
    return (weight - 32) * 9/5;
}

const stoneToLitres = (weight) => {
    return (weight - 32) * 9/5;
}



  const UnitConversions = {
      Litres: {
          KG: kgToLitres,
          Stone: stoneToLitres,
          Pounds: poundsToLitres,
      }
  }

  export default update;