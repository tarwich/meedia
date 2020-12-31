import faker from 'faker';
import { capitalize } from 'lodash';
import { useLocalObservable } from 'mobx-react-lite';
import { VBox } from './ui/vbox';

export type BossViewProps = {
  setBossMode(value: boolean): void;
};

export const BossView = (props: BossViewProps) => {
  const store = useLocalObservable(() => ({
    clickCount: 0,
  }));

  return (
    <VBox
      onClick={() => {
        ++store.clickCount;

        if (store.clickCount >= 5) props.setBossMode(false);
      }}
    >
      <h4>{faker.hacker.phrase()}</h4>
      {[...new Array(8)].map((_, iParagraph) => (
        <p key={iParagraph}>
          {[...new Array(10)]
            .map(() => capitalize(faker.hacker.phrase()))
            .join(' ')}
        </p>
      ))}
    </VBox>
  );
};
