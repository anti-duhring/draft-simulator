import { BORDER_GRAY, DARK_BLACK, LIGHT_ORANGE, ORANGE } from "../Colors";

export const SelectTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: BORDER_GRAY,
      primary: DARK_BLACK,
    },
  });

export const defaultStyles = {
option: (provided, state) => ({
    ...provided,
    /*borderBottom: '1px dotted pink',
    color: state.isSelected ? 'red' : 'blue',
    padding: 20,*/
    fontSize: '.8rem',
    cursor: 'pointer'
}),
control: (base) => ({
    // none of react-select's styles are passed to <Control />
    ...base,
    boxShadow: 'none',
    fontSize: '.8rem',
    cursor: 'pointer'
}),
singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
}
}