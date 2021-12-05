//古のコードたち (実行されない)
return;
/*
  static _createEndpost = (_type, _guildId) => {
    const apiPath = `https://discord.com/api/v8/applications/${String(
      client.user.id
    )}`;
    let _url;
    switch (_type) {
      case 'global':
        {
          _url = `${apiPath}/commands`;
        }
        break;
      case 'guild':
        {
          _url = `${apiPath}/guilds/${_guildId}/commands`;
        }
        break;
      default: {
        throw 'Invalid type：' + _type;
      }
    }
    return _url;
  };
 static async postCommandId(_definition, _guildId) {
    const response = await fetch(
      this._createEndpost(_definition.type, _guildId),
      {
        method: 'post',
        body: JSON.stringify({
          name: _definition.name,
          description: _definition.description,
          options: _definition.options
          //default_permission: _definition.default_permission
        }),
        headers: {
          Authorization: 'Bot ' + process.env.tokun,
          'Content-Type': 'application/json'
        }
      }
    ).catch(_error => {
      throw _error;
    });
    //console.log(response)
    if (response.status !== 200 && response.status !== 201) {
      throw response;
    }
    return response;
  }

  static async deleteCommandId(_type, _commandId, _guildId = null) {
    const response = await fetch(
      `${this._createEndpost(_type, _guildId)}/${_commandId}`,
      {
        method: 'delete',
        body: null,
        headers: {
          Authorization: 'Bot ' + process.env.tokun,
          'Content-Type': 'application/json'
        }
      }
    ).catch(_error => {
      throw _error;
    });
    //console.log(response.status)
    if (response.status != 204) {
      throw response;
    }
    return response;
  }

        client.api
        .interactions(_interaction.id, _interaction.token)
        .callback.post({
          data: return_value
        });
        */
