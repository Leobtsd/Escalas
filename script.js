
  const diasTurnos = [
    'turno-3', 'turno-3',
    'folguista', 'folguista',
    'turno-1', 'turno-1',
    'turno-2', 'turno-2'
  ];

  // Data fixa onde a rotação começou
  const dataReferencia = new Date(2025, 6, 17); // 17/07/2025 (mês 6 = julho)
  const idxReferencia = 0; // posição do turno-3 no array

  const hojeReal = new Date();
  let mesAtual = hojeReal.getMonth();
  let anoAtual = hojeReal.getFullYear();

  const feriadosNacionais = ['01-01', '21-04', '01-05', '07-09', '12-10', '02-11', '15-11', '25-12'];
  const feriadosJP = ['05-08', '24-06'];
  const feriadosAlhandra = ['20-01', '06-08'];

  const mesAnoEl = document.getElementById('mesAno');
  const tabela = document.getElementById('calendario');

  function gerarCalendario(mes, ano) {
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const totalDias = ultimoDia.getDate();
    const inicioSemana = primeiroDia.getDay();

    const nomeMes = primeiroDia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    mesAnoEl.textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

    let html = `
      <thead>
        <tr>
          <th>Dom</th><th>Seg</th><th>Ter</th><th>Qua</th><th>Qui</th><th>Sex</th><th>Sáb</th>
        </tr>
      </thead>
      <tbody>
        <tr>
    `;

    for (let i = 0; i < inicioSemana; i++) {
      html += '<td class="empty"></td>';
    }

    for (let dia = 1, diaSemana = inicioSemana; dia <= totalDias; dia++, diaSemana++) {
      const dataAtual = new Date(ano, mes, dia);

      // diferença de dias a partir da referência
      const diffDias = Math.floor((dataAtual - dataReferencia) / (1000 * 60 * 60 * 24));
      const idx = ((idxReferencia + diffDias) % 8 + 8) % 8;
      const classe = diasTurnos[idx];

      const pad = n => n.toString().padStart(2, '0');
      const dataStr = `${pad(dia)}-${pad(mes + 1)}`;
      const isFeriado =
        feriadosNacionais.includes(dataStr) ||
        feriadosJP.includes(dataStr) ||
        feriadosAlhandra.includes(dataStr);

      const ehHoje = dataAtual.toDateString() === hojeReal.toDateString();
      const classeHoje = ehHoje ? 'today' : '';

      html += `<td class="${classe} ${classeHoje}">
        ${dia}${isFeriado ? '<small>Feriado</small>' : ''}
      </td>`;

      if ((diaSemana + 1) % 7 === 0 && dia < totalDias) {
        html += '</tr><tr>';
      }
    }

    const ultDiaSemana = (inicioSemana + totalDias) % 7;
    if (ultDiaSemana !== 0) {
      for (let i = ultDiaSemana; i < 7; i++) {
        html += '<td class="empty"></td>';
      }
    }

    html += '</tr></tbody>';
    tabela.innerHTML = html;
  }

  function mudarMes(incremento) {
    mesAtual += incremento;
    if (mesAtual < 0) {
      mesAtual = 11;
      anoAtual -= 1;
    } else if (mesAtual > 11) {
      mesAtual = 0;
      anoAtual += 1;
    }
    gerarCalendario(mesAtual, anoAtual);
  }

  gerarCalendario(mesAtual, anoAtual);

