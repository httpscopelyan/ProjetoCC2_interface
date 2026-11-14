import { useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageSquareHeart, Send, Star } from "lucide-react";

import IconButton from "../../shared/ui/IconButton";
import { feedbackApi } from "../../shared/api/feedback";
import { Backdrop, Card, Field, Heading, Layer, Stars, StarButton, Submit, Thanks } from "./style";

const MAX_RATING = 5;
const RATINGS = Array.from({ length: MAX_RATING }, (_, i) => i + 1);

type Status = "editing" | "sending" | "sent";

const Feedback = () => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("editing");

  const close = () => {
    setOpen(false);
    setRating(0);
    setMessage("");
    setStatus("editing");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (rating === 0) return;
    setStatus("sending");
    await feedbackApi.send({ rating, message: message.trim() });
    setStatus("sent");
  };

  return (
    <>
      <IconButton icon={MessageSquareHeart} label="Enviar feedback" onClick={() => setOpen(true)} />

      <AnimatePresence>
        {open && (
          <>
            <Backdrop key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
            <Layer key="layer">
              <Card
                role="dialog"
                aria-label="Feedback"
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
              >
                {status === "sent" ? (
                  <Thanks>
                    <Heading>Obrigado pelo feedback!</Heading>
                    <Submit type="button" onClick={close}>
                      Fechar
                    </Submit>
                  </Thanks>
                ) : (
                  <form onSubmit={submit}>
                    <Heading>O que você achou do painel?</Heading>
                    <Stars>
                      {RATINGS.map((value) => (
                        <StarButton
                          key={value}
                          type="button"
                          $filled={value <= rating}
                          aria-label={`${value} de ${MAX_RATING} estrelas`}
                          onClick={() => setRating(value)}
                        >
                          <Star size={22} />
                        </StarButton>
                      ))}
                    </Stars>
                    <Field
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Conte o que podemos melhorar (opcional)"
                      rows={3}
                    />
                    <Submit type="submit" disabled={rating === 0 || status === "sending"}>
                      <Send size={14} />
                      {status === "sending" ? "Enviando…" : "Enviar"}
                    </Submit>
                  </form>
                )}
              </Card>
            </Layer>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Feedback;
