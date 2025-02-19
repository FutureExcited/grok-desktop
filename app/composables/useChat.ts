import { ref, computed } from "vue";

export interface Message {
  content: string;
  isUser: boolean;
}

export const useChat = () => {
  const message = ref("");
  const messages = ref<Message[]>([]);
  const hasStartedChat = ref(false);

  const showInitialContent = computed(
    () => !hasStartedChat.value && messages.value.length === 0
  );

  const sendMessage = () => {
    if (!message.value.trim()) return;

    messages.value.push({
      content: message.value,
      isUser: true,
    });

    // Add bot response (placeholder for now)
    messages.value.push({
      content: placeholder,
      isUser: false,
    });

    message.value = "";
    hasStartedChat.value = true;
  };

  return {
    message,
    messages,
    hasStartedChat,
    showInitialContent,
    sendMessage,
  };
};

const placeholder = `I'd love to help you brainstorm a dinner party menu! To get started, let's consider a few things: Do you have a theme in mind (e.g., Italian, Mediterranean, comfort food)? Are there any dietary restrictions (vegetarian, gluten-free, etc.)? And how many courses are you thinking—appetizers, main course, dessert, or a full spread?

Here's a starting point to spark some ideas, assuming a general crowd-pleasing vibe:

# Appetizers

* Mini Caprese Skewers: Cherry tomatoes, fresh mozzarella, basil, drizzled with balsamic glaze.
* Stuffed Mushrooms: Filled with garlic, cream cheese, and herbs—simple but always a hit.
* Bruschetta Bar: Toasted bread with options like tomato-basil, olive tapenade, or ricotta and honey.

# Main Course

* Herb-Roasted Chicken: Juicy, universally loved, and pairs well with sides like roasted potatoes or garlic green beans.
* Pasta Primavera: Fresh veggies, light lemon-cream sauce—easy to scale and customize (add shrimp or keep veggie).
* Grilled Salmon with Dill Sauce: A lighter protein option with a zesty kick.

# Sides

* Truffle Mashed Potatoes: Elevates the comfort factor without much extra effort.
* Charred Broccolini: Lemon zest and parmesan keep it bright and flavorful.
* Warm Bread Rolls: Because who doesn't love fresh bread?

# Dessert

* Chocolate Lava Cakes: Individual servings, gooey centers—impressive but doable.
* Lemon Berry Tart: Tangy and refreshing, with a buttery crust.
* Tiramisu: Make-ahead, crowd-pleasing, and feels fancy.

What do you think—any of these catch your eye? Or should we tweak it based on a specific vibe or guest preferences? Let me know!`;
