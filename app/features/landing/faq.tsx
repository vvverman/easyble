import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

const faqItems = [
  {
    question: 'Для кого сделан Easyble?',
    answer:
      'Easyble создаётся для продуктовых, креативных и техкоманд, которым важно не только успевать, но и не выгорать: когда тон задач и комментариев влияет на атмосферу не меньше, чем сроки.',
  },
  {
    question: 'Использует ли Easyble искусственный интеллект?',
    answer:
      'Да. ИИ в Easyble помогает переформулировать задачи и комментарии более мягко и понятно, подсказывает структуру описаний и вопросы для уточнения, но финальное решение всегда остаётся за людьми.',
  },
  {
    question: 'Сколько стоит Easyble?',
    answer:
      'Easyble — платный продукт для команд. Сейчас мы в активной разработке; точные тарифы и планы появятся ближе к публичному запуску.',
  },
  {
    question: 'Чем Easyble отличается от других таск‑менеджеров?',
    answer:
      'В центре Easyble — эмпатия и язык. Мы помогаем писать задачи так, чтобы в них меньше было пассивной агрессии и взаимных претензий и больше ясности, контекста и доверия внутри команды.',
  },
];

export function FAQ() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-primary mb-10 text-3xl font-semibold">
          Частые вопросы
        </h2>

        <Accordion type="single" collapsible>
          {faqItems.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>

              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
