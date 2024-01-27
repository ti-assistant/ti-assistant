import { FormattedMessage } from "react-intl";

export namespace Strings {
  export function Speaker() {
    return (
      <FormattedMessage
        id="knjCH0"
        description="The title of the player that has the Speaker token."
        defaultMessage="Speaker"
      />
    );
  }

  export function Units({ unit, count }: { unit: UnitType; count: number }) {
    switch (unit) {
      case "Carrier":
        return (
          <FormattedMessage
            id="jgVoqe"
            description="A number of Carrier units."
            defaultMessage="{count} {count, plural, one {Carrier} other {Carriers}}"
            values={{ count }}
          />
        );
      case "Cruiser":
        return (
          <FormattedMessage
            id="sJ5zBj"
            description="A number of Cruiser units."
            defaultMessage="{count} {count, plural, one {Cruiser} other {Cruisers}}"
            values={{ count }}
          />
        );
      case "Destroyer":
        return (
          <FormattedMessage
            id="mcZgiQ"
            description="A number of Destroyer units."
            defaultMessage="{count} {count, plural, one {Destroyer} other {Destroyers}}"
            values={{ count }}
          />
        );
      case "Dreadnought":
        return (
          <FormattedMessage
            id="SyY9is"
            description="A number of Dreadnought units."
            defaultMessage="{count} {count, plural, one {Dreadnought} other {Dreadnoughts}}"
            values={{ count }}
          />
        );
      case "Fighter":
        return (
          <FormattedMessage
            id="e8vqxH"
            description="A number of Fighter units."
            defaultMessage="{count} {count, plural, one {Fighter} other {Fighters}}"
            values={{ count }}
          />
        );
      case "Flagship":
        return (
          <FormattedMessage
            id="x5JPkJ"
            description="A number of Flagship units."
            defaultMessage="{count} {count, plural, one {Flagship} other {Flagships}}"
            values={{ count }}
          />
        );
      case "Infantry":
        return (
          <FormattedMessage
            id="YKYdmA"
            description="A number of Infantry units."
            defaultMessage="{count} {count, plural, one {Infantry} other {Infantry}}"
            values={{ count }}
          />
        );
      case "Mech":
        return (
          <FormattedMessage
            id="PptkAD"
            description="A number of Mech units."
            defaultMessage="{count} {count, plural, one {Mech} other {Mechs}}"
            values={{ count }}
          />
        );
      case "PDS":
        return (
          <FormattedMessage
            id="WpoPPE"
            description="A number of PDS units."
            defaultMessage="{count} {count, plural, one {PDS} other {PDS}}"
            values={{ count }}
          />
        );
      case "Space Dock":
        return (
          <FormattedMessage
            id="IG7CG4"
            description="A number of Space Dock units."
            defaultMessage="{count} {count, plural, one {Space Dock} other {Space Docks}}"
            values={{ count }}
          />
        );
      case "War Sun":
        return (
          <FormattedMessage
            id="rEazHY"
            description="A number of War Sun units."
            defaultMessage="{count} {count, plural, one {War Sun} other {War Suns}}"
            values={{ count }}
          />
        );
    }
    return "Pending";
  }
}
