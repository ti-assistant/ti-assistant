import { poster } from './util'

export async function updateOption(mutate, gameid, optionName, value) {
  const data = {
    action: "SET_OPTION",
    option: optionName,
    value: value,
  };

  mutate(`/api/${gameid}/options`, async () => await poster(`/api/${gameid}/optionUpdate`, data), {
    optimisticData: options => {
      const updatedOptions = structuredClone(options);

      updatedOptions[optionName] = value;

      return updatedObjectives;
    },
    revalidate: false,
  });
}