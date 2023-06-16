const { exec } = require('child_process');
const { openai_key } = require('../openaiConfig');

// Replace <LOCAL_FILE> with your actual file path
// let command1 = '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"';
let command1 = 'brew --version';
exec(command1, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error##########:: ${error}`);
        return;
    }
    console.log(`stdout1: ${stdout}`);
    console.error(`stderr1: ${stderr}`);

    let command2 = 'brew install python3';

    exec(command2, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error##########:: ${error}`);
            return;
        }
        console.log(`stdout2: ${stdout}`);
        console.error(`stderr2: ${stderr}`);

        let command3 = 'python3 -m ensurepip --upgrade';

        exec(command3, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error##########:: ${error}`);
                return;
            }
            console.log(`stdout3: ${stdout}`);
            console.error(`stderr3: ${stderr}`);

            let command4 = 'pip3 install --upgrade openai';

            exec(command4, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error##########:: ${error}`);
                    return;
                }
                console.log(`stdout4: ${stdout}`);
                console.error(`stder4: ${stderr}`);

                let command5 = 'pip3 install openai[datalib]';

                exec(command5, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error##########:: ${error}`);
                        return;
                    }
                    console.log(`stdout5: ${stdout}`);
                    console.error(`stder5: ${stderr}`);

    let command6 = 'openai tools fine_tunes.prepare_data -f sport2.jsonl -q';

    exec(command6, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error##########:: ${error}`);
            return;
        }
        console.log(`stdout6: ${stdout}`);
        console.error(`stder6: ${stderr}`);});

    // let command7 = `export OPENAI_API_KEY=${openai_key} && openai api fine_tunes.create -t file-AQQE8xe39PHGBfVAFfZhV7P6 -m ada`;
    // console.log(command7);
    // exec(command7, (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`exec error##########: ${error}`);
    //         return;
    //     }
    //     console.log(`stdout7: ${stdout}`);
    //     console.error(`stder7: ${stderr}`);});

    // let command8 = `export OPENAI_API_KEY=${openai_key} && openai api fine_tunes.follow -i ft-Le9XPNcGEdQNgktzzeXOSqzV`;

    // console.log(command8);
    // exec(command8, (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`exec error##########: ${error}`);
    //         return;
    //     }
    //     console.log(`stdout8: ${stdout}`);
    //     console.error(`stder8: ${stderr}`);
    //     let command9 = `export OPENAI_API_KEY=${openai_key} && openai api fine_tunes.follow -i ft-Le9XPNcGEdQNgktzzeXOSqzV`;

    //     console.log(command9);
    //     exec(command8, (error, stdout, stderr) => {
    //         if (error) {
    //             console.error(`exec error##########: ${error}`);
    //             return;
    //         }
    //         console.log(`stdout9: ${stdout}`);
    //         console.error(`stder9: ${stderr}`);
    //         let command10 = `export OPENAI_API_KEY=${openai_key} && openai api fine_tunes.follow -i ft-Le9XPNcGEdQNgktzzeXOSqzV`;

    //         console.log(command10);
    //         exec(command10, (error, stdout, stderr) => {
    //             if (error) {
    //                 console.error(`exec error##########: ${error}`);
    //                 return;
    //             }
    //             console.log(`stdout10: ${stdout}`);
    //             console.error(`stder10: ${stderr}`);
    //         });
    //     });
    // });

    // });
    //         });
    //     });
    // })
});


//export OPENAI_API_KEY=${openai_key} && openai api fine_tunes.create -t sport2_prepared_train.jsonl -v "sport2_prepared_valid.jsonl" --compute_classification_metrics --classification_positive_class " baseball" -m ada
});
});
});
});