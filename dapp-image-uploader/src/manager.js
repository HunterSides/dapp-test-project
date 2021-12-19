import { alert } from "ui/components";
import { directive, dom, emitter, node, render } from "ui/lib";
import { storage, user } from "dapp";
import image from "./upload/image";

let cache = [],
    id,
    initiated = false;

const noassets = identity => `
    <div class="card --background-grey-400 --border-radius-600 --flex-center --margin-top --margin-200 --padding --padding-800">
        <div class='--text-center'>
            No Assets found for the identity <br> <b class='--text-crop-bottom'>${identity}</b>
        </div>
    </div>
`;

const template = data => `
    <div class="card --background-white-400 --border-radius-600 --margin-top --margin-200 --padding --padding-500">
        <div class="--flex-row">
            <img alt="" class='image --background-black-500 --border-radius --border-radius-500 --flex-fixed --margin-right --margin-300 --size-800' src="">

            <div class="--flex-fill --flex-vertical">
                <div class="text-list --text-crop-top">
                    <b class="text --text-500">
                        ${data.name}
                    </b>

                    <div class="text --color-text-300 --margin-0px --padding-right --padding-400 --text-100">
                        <span class="--text-truncate">
                            ${data.description}
                        </span>
                    </div>
                </div>

                <div class="list --margin-100">
                    <div class="list-item list-item--bulletpoint --background-black-400 --text-200">
                        <a class='link --color-secondary --color-state --color-text-500 --inline --text-bold' href='https://ipfs.io/ipfs/${data.ipfs.image}' target='_blank'>
                            Open Using IPFS Gateway
                        </a>
                    </div>
                    <div class="list-item list-item--bulletpoint --background-black-400 --text-200">
                        <a class='link --color-secondary --color-state --color-text-500 --inline --text-bold' href='https://cloudflare-ipfs.com/ipfs/${data.ipfs.image}' target='_blank'>
                            Open Using Cloudflare IPFS Gateway
                        </a>
                    </div>
                </div>
            </div>

            
            <div class="--width --width-400">
                <div class="button button--circle tooltip --background-state --background-white --color-black-400 --color-state --color-text --padding-300" data-bind='{"id": "${data.id}", "name": "${data.name}", "refs": {"modal": "modal.delete"}}' data-click='manager.delete.click' data-hover='tooltip'>
                    <div class="icon">
                        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M14.001 2.25h-3.688V.578A.578.578 0 009.734 0H6.265a.578.578 0 00-.578.578V2.25H2.001a1 1 0 000 2h12a1 1 0 100-2zM6.843 1.157h2.313V2.25H6.843V1.157zM8 5.45H2.771l.614 9.536A1.166 1.166 0 004.541 16h6.918c.592 0 1.08-.441 1.156-1.014l.613-9.536H8z"/></svg>
                    </div>

                    <span class="tooltip-message tooltip-message--ne">
                        Delete Asset
                    </span>
                </div>
            </div>
        </div>
    </div>
`;
const del = {
    click: function() {
        id = this.id;

        if (!id) {
            alert.error("Cannot proceed, missing document id");
            return;
        }

        let name = dom.ref("delete.name");

        if (name) {
            dom.update(() => {
                node.text(name.element, this.name);
            });
        }

        directive.dispatch("modal", {}, this);
    },
    confirm: async function() {
        if (!id) {
            alert.error("Cannot proceed, missing document id");
            return;
        }

        this.element.classList.add("button--processing");

        await manifest.delete([cache[id]]);

        alert.success(`Successfully deleted asset: ${id}`);
        emitter.dispatch("assets.modified");

        dom.ref("modals.container").element.click();
    }
};

const init = async function() {
    let assets,
        identity = await user.identity.get(),
        rows = (dom.ref("manager.rows") || {}).element;

    if (!rows) {
        return;
    }

    assets = await image.read({
        where: [["$ownerId", "==", identity]]
    });
    console.log(identity, "identity");
    console.log(assets, "assets");
    if (!assets.length) {
        dom.update(() => {
            node.html(rows, { inner: noassets(identity) });
        });
        return;
    }

    assets = assets.map(response => {
        let id = response.id.toString();

        cache[id] = response;
        cache[id].data.id = id;

        return cache[id].data;
    });

    dom.update(() => {
        node.html(rows, { inner: render.template(template, assets) });
    });
};

directive.on("manager.delete.click", del.click);
directive.on("manager.delete.confirm", del.confirm);

emitter.on("user.init", () => {
    if (initiated) {
        return;
    }

    initiated = true;

    setTimeout(init, 1000);
});
emitter.on("assets.modified", init);

export default { cache };
