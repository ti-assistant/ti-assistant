import { IntlShape } from "react-intl";

export default function getTwilightsFallTechs(
  intl: IntlShape
): Record<TwilightsFall.TechId, BaseTech> {
  return {
    // The Ruby Monarch
    "Wavelength Red": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Wavelength.Description",
          description: "Description for Tech: Wavelength",
          defaultMessage:
            "Your ships can move into and through asteroid fields.{br}When you activate a system, you may explore 1 planet in that system that contains 1 or more of your units.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "The Ruby Monarch",
      id: "Wavelength Red",
      name: intl.formatMessage({
        id: "The Ruby Monarch.Techs.Wavelength Red.Title",
        description: "Title of Tech: Wavelength Red",
        defaultMessage: "Wavelength: Red",
      }),
      prereqs: [],
      type: "OTHER",
    },
    "Antimatter Red": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Antimatter.Description",
          description: "Description for Tech: Antimatter",
          defaultMessage:
            "Your ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system.{br}After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "The Ruby Monarch",
      id: "Antimatter Red",
      name: intl.formatMessage({
        id: "The Ruby Monarch.Techs.Antimatter Red.Title",
        description: "Title of Tech: Antimatter Red",
        defaultMessage: "Antimatter: Red",
      }),
      prereqs: [],
      type: "OTHER",
    },
    // Radiant Aur
    "Wavelength Orange": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Wavelength.Description",
          description: "Description for Tech: Wavelength",
          defaultMessage:
            "Your ships can move into and through asteroid fields.{br}When you activate a system, you may explore 1 planet in that system that contains 1 or more of your units.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "Radiant Aur",
      id: "Wavelength Orange",
      name: intl.formatMessage({
        id: "Radiant Aur.Techs.Wavelength Orange.Title",
        description: "Title of Tech: Wavelength Orange",
        defaultMessage: "Wavelength: Orange",
      }),
      prereqs: [],
      type: "OTHER",
    },
    "Antimatter Orange": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Antimatter.Description",
          description: "Description for Tech: Antimatter",
          defaultMessage:
            "Your ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system.{br}After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "Radiant Aur",
      id: "Antimatter Orange",
      name: intl.formatMessage({
        id: "Radiant Aur.Techs.Antimatter Orange.Title",
        description: "Title of Tech: Antimatter Orange",
        defaultMessage: "Antimatter: Orange",
      }),
      prereqs: [],
      type: "OTHER",
    },
    // Avarice Rex
    "Wavelength Yellow": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Wavelength.Description",
          description: "Description for Tech: Wavelength",
          defaultMessage:
            "Your ships can move into and through asteroid fields.{br}When you activate a system, you may explore 1 planet in that system that contains 1 or more of your units.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "Avarice Rex",
      id: "Wavelength Yellow",
      name: intl.formatMessage({
        id: "Avarice Rex.Techs.Wavelength Yellow.Title",
        description: "Title of Tech: Wavelength Yellow",
        defaultMessage: "Wavelength: Yellow",
      }),
      prereqs: [],
      type: "OTHER",
    },
    "Antimatter Yellow": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Antimatter.Description",
          description: "Description for Tech: Antimatter",
          defaultMessage:
            "Your ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system.{br}After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "Avarice Rex",
      id: "Antimatter Yellow",
      name: intl.formatMessage({
        id: "Avarice Rex.Techs.Antimatter Yellow.Title",
        description: "Title of Tech: Antimatter Yellow",
        defaultMessage: "Antimatter: Yellow",
      }),
      prereqs: [],
      type: "OTHER",
    },
    // Il Sai Lakoe
    "Wavelength Green": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Wavelength.Description",
          description: "Description for Tech: Wavelength",
          defaultMessage:
            "Your ships can move into and through asteroid fields.{br}When you activate a system, you may explore 1 planet in that system that contains 1 or more of your units.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "Il Sai Lakoe",
      id: "Wavelength Green",
      name: intl.formatMessage({
        id: "Il Sai Lakoe.Techs.Wavelength Green.Title",
        description: "Title of Tech: Wavelength Green",
        defaultMessage: "Wavelength: Green",
      }),
      prereqs: [],
      type: "OTHER",
    },
    "Antimatter Green": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Antimatter.Description",
          description: "Description for Tech: Antimatter",
          defaultMessage:
            "Your ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system.{br}After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "Il Sai Lakoe",
      id: "Antimatter Green",
      name: intl.formatMessage({
        id: "Il Sai Lakoe.Techs.Antimatter Green.Title",
        description: "Title of Tech: Antimatter Green",
        defaultMessage: "Antimatter: Green",
      }),
      prereqs: [],
      type: "OTHER",
    },
    // The Saint of Swords
    "Wavelength Blue": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Wavelength.Description",
          description: "Description for Tech: Wavelength",
          defaultMessage:
            "Your ships can move into and through asteroid fields.{br}When you activate a system, you may explore 1 planet in that system that contains 1 or more of your units.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "The Saint of Swords",
      id: "Wavelength Blue",
      name: intl.formatMessage({
        id: "The Saint of Swords.Techs.Wavelength Blue.Title",
        description: "Title of Tech: Wavelength Blue",
        defaultMessage: "Wavelength: Blue",
      }),
      prereqs: [],
      type: "OTHER",
    },
    "Antimatter Blue": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Antimatter.Description",
          description: "Description for Tech: Antimatter",
          defaultMessage:
            "Your ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system.{br}After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "The Saint of Swords",
      id: "Antimatter Blue",
      name: intl.formatMessage({
        id: "The Saint of Swords.Techs.Antimatter Blue.Title",
        description: "Title of Tech: Antimatter Blue",
        defaultMessage: "Antimatter: Blue",
      }),
      prereqs: [],
      type: "OTHER",
    },
    // Il Na Viroset
    "Wavelength Purple": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Wavelength.Description",
          description: "Description for Tech: Wavelength",
          defaultMessage:
            "Your ships can move into and through asteroid fields.{br}When you activate a system, you may explore 1 planet in that system that contains 1 or more of your units.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "Il Na Viroset",
      id: "Wavelength Purple",
      name: intl.formatMessage({
        id: "Il Na Viroset.Techs.Wavelength Purple.Title",
        description: "Title of Tech: Wavelength Purple",
        defaultMessage: "Wavelength: Purple",
      }),
      prereqs: [],
      type: "OTHER",
    },
    "Antimatter Purple": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Antimatter.Description",
          description: "Description for Tech: Antimatter",
          defaultMessage:
            "Your ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system.{br}After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "Il Na Viroset",
      id: "Antimatter Purple",
      name: intl.formatMessage({
        id: "Il Na Viroset.Techs.Antimatter Purple.Title",
        description: "Title of Tech: Antimatter Purple",
        defaultMessage: "Antimatter: Purple",
      }),
      prereqs: [],
      type: "OTHER",
    },
    // El Nen Janovet
    "Wavelength Magenta": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Wavelength.Description",
          description: "Description for Tech: Wavelength",
          defaultMessage:
            "Your ships can move into and through asteroid fields.{br}When you activate a system, you may explore 1 planet in that system that contains 1 or more of your units.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "El Nen Janovet",
      id: "Wavelength Magenta",
      name: intl.formatMessage({
        id: "El Nen Janovet.Techs.Wavelength Magenta.Title",
        description: "Title of Tech: Wavelength Magenta",
        defaultMessage: "Wavelength: Magenta",
      }),
      prereqs: [],
      type: "OTHER",
    },
    "Antimatter Magenta": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Antimatter.Description",
          description: "Description for Tech: Antimatter",
          defaultMessage:
            "Your ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system.{br}After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "El Nen Janovet",
      id: "Antimatter Magenta",
      name: intl.formatMessage({
        id: "El Nen Janovet.Techs.Antimatter Magenta.Title",
        description: "Title of Tech: Antimatter Magenta",
        defaultMessage: "Antimatter: Magenta",
      }),
      prereqs: [],
      type: "OTHER",
    },
    // A Sickening Lurch
    "Wavelength Black": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Wavelength.Description",
          description: "Description for Tech: Wavelength",
          defaultMessage:
            "Your ships can move into and through asteroid fields.{br}When you activate a system, you may explore 1 planet in that system that contains 1 or more of your units.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "A Sickening Lurch",
      id: "Wavelength Black",
      name: intl.formatMessage({
        id: "A Sickening Lurch.Techs.Wavelength Black.Title",
        description: "Title of Tech: Wavelength Black",
        defaultMessage: "Wavelength: Black",
      }),
      prereqs: [],
      type: "OTHER",
    },
    "Antimatter Black": {
      description: intl.formatMessage(
        {
          id: "Twilight's Fall.Techs.Antimatter.Description",
          description: "Description for Tech: Antimatter",
          defaultMessage:
            "Your ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system.{br}After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token.",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      faction: "A Sickening Lurch",
      id: "Antimatter Black",
      name: intl.formatMessage({
        id: "A Sickening Lurch.Techs.Antimatter Black.Title",
        description: "Title of Tech: Antimatter Black",
        defaultMessage: "Antimatter: Black",
      }),
      prereqs: [],
      type: "OTHER",
    },
  };
}
