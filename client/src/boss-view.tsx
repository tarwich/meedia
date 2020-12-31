import faker from 'faker';
import { capitalize } from 'lodash';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTimeout } from 'rooks';
import { VBox } from './ui/vbox';

export type BossViewProps = {
  setBossMode(value: boolean): void;
};

const makeSentence = () => capitalize(faker.hacker.phrase().replace('!', '.'));

export const BossView = observer((props: BossViewProps) => {
  const store = useLocalObservable(() => ({
    clickCount: 0,
    title: makeSentence(),
    paragraphs: [...new Array(8)].map((_, iParagraph) =>
      [...new Array(10)].map(() => makeSentence()).join(' ')
    ),
  }));
  const { start, clear } = useTimeout(() => void (store.clickCount = 0), 5000);

  return (
    <VBox
      onClick={() => {
        clear();
        start();
        ++store.clickCount;

        if (store.clickCount >= 5) props.setBossMode(false);
      }}
    >
      <h4>{store.title}</h4>
      {store.paragraphs.map((text, iParagraph) => (
        <p key={iParagraph}>{text}</p>
      ))}
      <span>{''.padEnd(store.clickCount, '.')}</span>
    </VBox>
  );
});
