const firebase =
  "https://bookmark-vue-9e70a-default-rtdb.asia-southeast1.firebasedatabase.app/";

export default {
  // カード関連
  async fetchCards({ getters, commit }) {
    let response;

    if (getters.loginMode === "user") {
      response = await fetch(
        `${firebase}/users/${getters.userId}/cards.json?auth=` + getters.token,
        { method: "GET" }
      );
    } else if (getters.loginMode === "guest" && !getters.didFetchSample) {
      response = await fetch(`${firebase}/guest/cards/.json`, {
        method: "GET",
      });
      commit("setFetchSample", null, { root: true });
    } else {
      return;
    }

    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || "データを読み込めませんでした。"
      );
      throw error;
    }

    const cards = [];
    for (const key in responseData) {
      const card = {
        id: responseData[key].id,
        title: responseData[key].title,
        tags: responseData[key].tags || [],
        links: responseData[key].links || [],
      };
      cards.push(card);
    }
    commit("setCards", cards);
  },

  async createCard({ getters, commit }, { index, newCard }) {
    const newCards = [...getters.storedCards, newCard];
    commit("createCard", newCards);

    if (getters.loginMode === "user") {
      const response = await fetch(
        `${firebase}/users/${getters.userId}/cards/${index}.json?auth=` +
          getters.token,
        { method: "PUT", body: JSON.stringify(newCard) }
      );
      if (!response.ok) {
        const error = new Error("データを正常に送信できませんでした。");
        throw error;
      }

      //   `${firebase}/users/${getters.userId}/cards/${payload.newCard.id}.json?auth=` +
      //     getters.token,
      // { method: "PUT", body: JSON.stringify(payload.newCard) }
    }

    //   try {
    //     await fetch(`${firebase}/guest/cards/${payload.id}.json`, {
    //       method: "PUT",
    //       body: JSON.stringify(newCard),
    //     });
    //   } catch (error) {
    //     console.log(error.message);
    //   }
  },

  async deleteCard({ getters, commit }, { newCards }) {
    if (getters.loginMode === "user") {
      await fetch(
        `${firebase}/users/${getters.userId}/cards/.json?auth=` + getters.token,
        { method: "PUT", body: JSON.stringify(newCards) }
      );
    }
    commit("deleteCard", { newCards });
  },

  async editCardTitle({ getters, commit }, { index, newTitle }) {
    if (getters.loginMode === "user") {
      await fetch(
        `${firebase}/users/${getters.userId}/cards/${index}/title/.json?auth=` +
          getters.token,
        {
          method: "PUT",
          body: JSON.stringify(newTitle),
        }
      );
    }
    commit("editCardTitle", { index, newTitle });
  },

  sortCard({ commit }, { sortedCards }) {
    commit("sortCard", { sortedCards });
  },

  async saveOrder({ getters }, { sortedCards }) {
    if (getters.loginMode === "user") {
      // await fetch(
      //   `${firebase}/users/${getters.userId}/cards/.json?auth=` + getters.token,
      //   {
      //     method: "PUT",
      //     body: JSON.stringify(sortedCards),
      //   }
      // );

      console.log(sortedCards);
    }
  },

  // タグ関連
  async addTag({ getters, commit }, { index, newTags }) {
    if (getters.loginMode === "user") {
      await fetch(
        `${firebase}/users/${getters.userId}/cards/${index}/tags/.json?auth=` +
          getters.token,
        {
          method: "PUT",
          body: JSON.stringify(newTags),
        }
      );
    }
    commit("addTag", { index, newTags });
  },

  async deleteTag({ getters, commit }, { index, newTags }) {
    if (getters.loginMode === "user") {
      await fetch(
        `${firebase}/users/${getters.userId}/cards/${index}/tags/.json?auth=` +
          getters.token,
        {
          method: "PUT",
          body: JSON.stringify(newTags),
        }
      );
    }
    commit("deleteTag", { index, newTags });
  },

  // リンク関連
  async incrementCount({ getters, commit }, payload) {
    if (getters.loginMode === "user") {
      await fetch(
        `${firebase}/users/${getters.userId}/cards/${payload.cardIndex}/links/${payload.linkIndex}/clickCount.json?auth=` +
          getters.token,
        {
          method: "PUT",
          body: JSON.stringify(payload.newCount),
        }
      );
    }
    commit("incrementCount", payload);
  },

  async addLink({ getters, commit }, payload) {
    if (getters.loginMode === "user") {
      await fetch(
        `${firebase}/users/${getters.userId}/cards/${payload.cardIndex}/links/.json?auth=` +
          getters.token,
        {
          method: "PUT",
          body: JSON.stringify(payload.newLinks),
        }
      );
    }
    commit("addLink", payload);
  },

  async editLink({ getters, commit }, payload) {
    if (getters.loginMode === "user") {
      await fetch(
        `${firebase}/users/${getters.userId}/cards/${payload.cardIndex}/links/${payload.linkIndex}.json?auth=` +
          getters.token,
        {
          method: "PATCH",
          body: JSON.stringify(payload.newLink),
        }
      );
    }
    commit("editLink", payload);
  },

  async deleteLink({ getters, commit }, payload) {
    if (getters.loginMode === "user") {
      await fetch(
        `${firebase}/users/${getters.userId}/cards/${payload.cardIndex}/links.json?auth=` +
          getters.token,
        {
          method: "PUT",
          body: JSON.stringify(payload.newList),
        }
      );
    }
    commit("deleteLink", payload);
  },

  async resetClickCount({ commit }) {
    commit("resetClickCount");
  },
};
