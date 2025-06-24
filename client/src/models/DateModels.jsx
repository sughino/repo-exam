import { string } from 'yup';
import { parse, isValid, isAfter, isBefore, subYears, addYears } from 'date-fns';

export function dateFieldSchema(required = true, minToday = false, maxToday = false) {
  let schema = string()
    .test('valid-date', 'Date must be valid', (value) => {
      if (!value) return !required;
      const parsed = parse(value, 'yyyy/MM/dd', new Date());
      return isValid(parsed);
    })
    .test('min-date', 'Date is too old', (value) => {
      if (!value) return !required;
      const parsed = parse(value, 'yyyy/MM/dd', new Date());
      return isValid(parsed) && isAfter(parsed, minToday ? new Date() : subYears(new Date(), 50));
    })
    .test('max-date', 'Date is too future', (value) => {
      if (!value) return !required;
      const parsed = parse(value, 'yyyy/MM/dd', new Date());
      return isValid(parsed) && isBefore(parsed, maxToday ? new Date() : addYears(new Date(), 50));
    });

  if (required) {
    schema = schema.required('Required!');
  }

  return schema;
}