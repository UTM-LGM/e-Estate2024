using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        private readonly ICountryRepository _countryRepository;

        public CountriesController(ICountryRepository countryRepository)
        {
            _countryRepository = countryRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetCountries()
        {
            var countries = await _countryRepository.GetAll();
            return Ok(countries);
        }

        [HttpPost]
        public async Task<IActionResult> AddCountry([FromBody] Country country)
        {
            country.createdDate = DateTime.Now;
            var addedCountry = await _countryRepository.Add(country);
            return Ok(addedCountry);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateCountry([FromBody] Country country)
        {
           country.updatedDate = DateTime.Now;
           var updatedCountry = await _countryRepository.Update(country);
           return Ok(updatedCountry);
        }

        [HttpGet]
        public async Task<IActionResult> GetCountriesAsc()
        {
            var countries = await _countryRepository.GetCountriesAsc();
            return Ok(countries);
        }
    }
}
