      // Aquí tu código

      let levels
      let keys
      let keysSpeed
      
      const keyboardKeys = document.querySelectorAll('.key')
      const keyboardKeysLength = keyboardKeys.length
      const levelbox = document.getElementById('levelbox')
      const keyboard = document.getElementById('keyboard')

      function startGame (levelNumber) {
        responsiveVoice.setDefaultVoice("Spanish Latin American Female");
        levelbox.className = 'levelbox'
        keyboard.classList.add('active')
        switch (levelNumber) {
          case 1:
            levels = 5
            keysSpeed = 1000
            break
          case 2:
            levels = 10
            keysSpeed = 600
            break
          default:
            levels = 15
            keysSpeed = 400
        }
        keys = generateKeys(levels)
        nextLevel(0)
      }      

      function nextLevel(currentLevel){ 
        if(currentLevel==levels){
          //alert('Ganaste')
          return swal({
            title: '¡Ganaste!',
            icon: 'success',
            text: `¿Quieres jugar de nuevo?`,
            buttons: ['No', 'Si']
          }).then(ok => {
            if (ok) {
              levelbox.classList.add('active')
              keyboard.className = 'keyboard'
            }else {
              swal('¡Gracias por jugar!');
            }
          });          
        }
        
        //alert(`Nivel actual ${currentLevel + 1}`)
        swal({
            timer: 1000,
            text: `Nivel ${currentLevel + 1} / ${levels}`,
            button: false
          })

        // Computer shows the current sequence
        
        for (let i=0;i<=currentLevel;i++){
          setTimeout(() => {
                            activate(keys[i])
                            if(i == currentLevel) {
                              startEventCapture()
                            }
                           }, 
                           keysSpeed * (i+1) + 500)          
        }

         // Pointer is on first sequence position
        let i=0
        let currentKey = keys[i]

        function startEventCapture(){
          window.addEventListener('keydown', onkeydown)
          for (let k = 0; k < keyboardKeysLength; k++) {
              keyboardKeys[k].addEventListener('click', onclick)
          }
        }

        function onkeydown (ev) {
            keyPressed(ev.keyCode)
        }
        
        function onclick (ev) {
            keyPressed(ev.target.innerHTML.toUpperCase().charCodeAt(0))
        }

        function keyPressed (key) {
            if (key == currentKey) {
                activate(currentKey, { success: true })
                i++
                if (i > currentLevel) {
                  window.removeEventListener('keydown', onkeydown)
                  for (let k = 0; k < keyboardKeysLength; k++) {
                    keyboardKeys[k].removeEventListener('click', onclick)
                  }
                  setTimeout(() => nextLevel(i), 1500)
                }
                currentKey = keys[i]
              } else {
                activate(key, { fail: true })
                window.removeEventListener('keydown', onkeydown)
                for (let k = 0; k < keyboardKeysLength; k++) {
                  keyboardKeys[k].removeEventListener('click', onclick)
                }
                setTimeout(() => {
                  swal({
                    title: 'Perdiste :(',
                    icon: 'error',
                    text: `Has pulsado ${String.fromCharCode(
                      key
                    ).toUpperCase()} y debias pulsar ${String.fromCharCode(
                      keys[i]
                    )}\n¿Quieres intentarlo de nuevo?`,
                    buttons: ['No', 'Si']
                  }).then(ok => {
                    if (ok) {
                      levelbox.classList.add('active')
                      keyboard.className = 'keyboard'
                    }else {
                      swal('¡Gracias por jugar!');
                    }
                  });
                }, 1000);
             }
            }
        }

      function generateKeys(){
        return new Array(levels).fill(0).map(generateRandomKey)
      }

      function generateRandomKey(){
          const min=65, max=90
          return Math.round(Math.random()*(max-min)+min)
      } 

      function getElementByKeyCode(keyCode){
        return document.querySelector(`[data-key="${keyCode}"]`) 
      }

      function activate(keyCode,opts={}){
        const el = getElementByKeyCode(keyCode)
        el.className ='key'
        el.classList.add('active')
        if(opts.success){
          el.classList.add('success')
        }else if(opts.fail){
          el.classList.add('fail')
        }
        responsiveVoice.speak(`${String.fromCharCode(keyCode).toLowerCase()}`);
        setTimeout(()=>deactivate(el),500)
      }

      function deactivate(el){
        el.className ='key'
      }
