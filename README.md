DAPP Uploader Multi Asset Project

This application is setup to utilize infrastructure built by ICJR to create a DAPP that can save/upload image, video and audio files using Dash Platform and IPFS.

Current State:

Right now there are issues preventing users to successfully utlize the uploader and save assets to Dash Platform. Once these issues are resolved users should be able to test the DAPP functionality and development/testing can be continued.

Additional information:

Included in this reposity is an images folder which includes images showing an example of rendered assets after they have been successfully saved/uploaded and also console output of the current errors you receive when trying to use the uploaders.

How to test:

1.  Once repo is cloned run your live server
2.  find the uploader you would like to test and open it
3.  to upload an asset open the dist folder and then add the uploader.html endpoint to your url which will render the uploader component

    -   You will be prompted to fund a wallet using testnet and tdash to secure your connection to dashplatform before you're able to use the uploader. To fund your wallet you can use this faucet https://testnet-faucet.dash.org/

    -   Once you have a wallet funded refresh the page and you should be able to use the uploader.

        -   After a successful upload you will receive a console message with the data pertaining to the assets contract information.

4.  After you upload your asset connect to the dist/ endpoint in your brower which will load the index.html file responsible for rendering the saved assets including links to them on IPFS

5.  Repeat with each respective uploader

Future versions will include the ability to upload and view all assets from the root directory instead of relying on being in each assets respective sub-directory
