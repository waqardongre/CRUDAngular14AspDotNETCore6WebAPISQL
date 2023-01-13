using System;
using System.Collections.Generic;

namespace CRUDWebAPI.Models;

public partial class Country
{
    public int CountryId { get; set; }

    public string CountryName { get; set; } = null!;

    public virtual ICollection<State> States { get; } = new List<State>();
}
