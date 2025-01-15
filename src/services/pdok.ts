const baseUrl =
  import.meta.env.VITE_PDOK_LOCATIONSERVICE || 'https://api.pdok.nl/bzk/locatieserver/search/v3_1'

const callPDOK = async function callPDOK(endpoint: string) {
  const response = await fetch(`${baseUrl}/${endpoint}`)

  if (response.ok) {
    try {
      return response.json()
    } catch (e) {
      console.log('Failed to process PDOK response.')
    }
  }

  return null
}

export const getSuggestions = async function getSuggestions(
  query: string,
  count: number | undefined | null
) {
  return await callPDOK(
    `suggest?q=${query}&rows=${count || 5}&fq=type:(adres)` // &fq=type:(woonplaats OR postcode OR adres)
  )
}

export const getSuggestionsNearCoordinates = async function getSuggestionsByCoordinates(
  query: string,
  lat: string | number,
  lon: string | number,
  count: number | undefined | null
) {
  return await callPDOK(
    `suggest?q=${query}&lat=${lat.toString()}&lon=${lon.toString()}&rows=${count || 5}&fq=type:(woonplaats OR postcode OR adres)`
  )
}

export const getReverse = async function getReverse(
  lat: string | number,
  lon: string | number,
  count: number | undefined | null
) {
  return await callPDOK(
    `reverse?lat=${lat.toString()}&lon=${lon.toString()}&rows=${count || 5}&fq=type:(adres)`
  )
}

export const getLookup = async function getLookup(id: string) {
  return await callPDOK(`lookup?id=${id}`)
}

/// <summary>
///     Suggest addresses based on a query.
/// </summary>
// public async Task<List<PDOKSuggestion>> SuggestAsync(string query, int rows = 10)
// {
//     var response = await httpClient.GetAsync($"suggest?fq=type:adres&q={query}&rows={rows}");
//     if (!response.IsSuccessStatusCode)
//     {
//         _logger.LogError("Location server API call failed with status code {StatusCode}", response.StatusCode);

//         throw new HttpRequestException("Location server API call failed.");
//     }

//     var jsonResponse = await response.Content.ReadAsStringAsync();
//     var responseObject = JsonSerializer.Deserialize<LocationServerResult>(jsonResponse);

//     var suggestions = new List<PDOKSuggestion>();
//     foreach (var highlightProperty in responseObject.highlighting.EnumerateObject())
//     {
//         var suggestionProperty = highlightProperty.Value.GetProperty("suggest");

//         if (suggestionProperty.GetArrayLength() == 0)
//         {
//             continue;
//         }

//         var suggestion = suggestionProperty[0].GetString();
//         if (string.IsNullOrEmpty(suggestion))
//         {
//             continue;
//         }

//         suggestions.Add(new PDOKSuggestion
//         {
//             Id = highlightProperty.Name,
//             Suggestion = suggestion,
//         });
//     }

//     return suggestions;
// }
