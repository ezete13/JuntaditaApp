/*
      //Crear arreglo personas
      personas = [
        { id: "c", num: 12500 },
        { id: "a", num: 5400 },
        { id: "s", num: 0 },
        { id: "m", num: 2300 },
        { id: "d", num: 6000 },
      ];
      
      personas = [
        { id: "c", num: 8000 },
        { id: "a", num: 4000 },
        { id: "s", num: 0 },
        { id: "m", num: 0 },
      ];

      let prom = 0;

      console.log("Arreglo Inicial", personas);

      //Calcular promedio
      personas.forEach((persona) => {
        prom += persona.num;
      });
      prom = prom / personas.length;
      console.log("Pago de cada uno", prom);

      //Restar promedio a cada persona
      personas.forEach((persona) => {
        //persona.num = persona.num - prom;
        persona.num = +(persona.num - prom).toFixed(2);
      });
      console.log("Resta del promedio con lo aportado", personas);

      //Ordenar de mayor a menor
      personasOrdenadas = personas.sort((a, b) => b.num - a.num);
      console.log("Ordenar de mayor a menor", personasOrdenadas);

      // Dividir los positivos de los negativos
      const personasPositivas = personasOrdenadas.filter(
        (persona) => persona.num > 0
      );
      const personasNegativas = personasOrdenadas.filter(
        (persona) => persona.num < 0
      );

      console.log("Personas Positivas:", personasPositivas);
      console.log("Personas Negativas:", personasNegativas);

      //Funcion para transferir saldos
      const transferencias = [];

      personasPositivas.forEach((positiva) => {
        personasNegativas.forEach((negativa) => {
          if (positiva.num > 0 && negativa.num < 0) {
            const transferir = Math.min(positiva.num, Math.abs(negativa.num));
            positiva.num = +(positiva.num - transferir).toFixed(2);
            negativa.num = +(negativa.num + transferir).toFixed(2);

            transferencias.push({
              de: negativa.id,
              para: positiva.id,
              monto: transferir.toFixed(2),
            });
          }
        });
      });

      console.log("Transferencias realizadas:");
      transferencias.forEach((t) => {
        console.log(`${t.de} debe transferir $${t.monto} a ${t.para}`);
      });

      console.log("Estado final de personas:");
      console.log("Positivas:", personasPositivas);
      console.log("Negativas:", personasNegativas); */