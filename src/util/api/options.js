import { poster } from './util'

export async function updateOption(mutate, gameid, options, optionName, value) {
  const data = {
    action: "SET_OPTION",
    option: optionName,
    value: value,
  };

  const updatedOptions = {...options};

  updatedOptions[optionName] = value;

  const updateOptions = {
    optimisticData: updatedOptions,
  };

  await mutate(`/api/${gameid}/options`, poster(`/api/${gameid}/optionUpdate`, data), updateOptions);
}